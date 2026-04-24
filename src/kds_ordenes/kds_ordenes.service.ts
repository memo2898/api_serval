import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateKdsOrdeneDto } from './dto/create-kds_ordene.dto';
import { UpdateKdsOrdeneDto } from './dto/update-kds_ordene.dto';
import { KdsOrdeneFiltersDto } from './dto/pagination.dto';
import { KdsOrdene } from './entities/kds_ordene.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';
import { OrdenLineaModificadore } from '../orden_linea_modificadores/entities/orden_linea_modificadore.entity';

@Injectable()
export class KdsOrdenesService {
  constructor(
    @InjectRepository(KdsOrdene)
    private kdsOrdenesRepository: Repository<KdsOrdene>,
    @InjectRepository(OrdenLineaModificadore)
    private modificadoresRepo: Repository<OrdenLineaModificadore>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateKdsOrdeneDto) {
    try {
      const record = this.kdsOrdenesRepository.create(dto);
      return await this.kdsOrdenesRepository.save(record);
    } catch (error: unknown) {
      throw new HttpException(
        `Error al crear el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Sin query params  → retorna un array plano: [{}, {}, {}]
   * Con cualquier param → retorna { data: [...], meta: {...} }
   */
  async findAll(
    filters: KdsOrdeneFiltersDto,
  ): Promise<KdsOrdene[] | PaginationResponse<KdsOrdene>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.kdsOrdenesRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.kdsOrdenesRepository.createQueryBuilder('kdsOrdene');
      this.applyFilters(qb, filterParams);
      this.applySorting(qb, sort);

      if (page !== undefined && limit !== undefined) {
        const p = Number(page);
        const l = Number(limit);
        const [data, total] = await qb.skip((p - 1) * l).take(l).getManyAndCount();
        const totalPages = Math.ceil(total / l);
        return {
          data,
          meta: { total, page: p, limit: l, totalPages, hasNext: p < totalPages, hasPrev: p > 1 },
        };
      }

      const data = await qb.getMany();
      return {
        data,
        meta: { total: data.length, page: 1, limit: data.length, totalPages: 1, hasNext: false, hasPrev: false },
      };
    } catch (error: unknown) {
      throw new HttpException(
        `Error al obtener los registros: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const record = await this.kdsOrdenesRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`KdsOrdene con ID ${id} no encontrado`);
      }
      return record;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al obtener el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, dto: UpdateKdsOrdeneDto) {
    try {
      const existing = await this.kdsOrdenesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`KdsOrdene con ID ${id} no encontrado`);
      }
      await this.kdsOrdenesRepository.update(id, dto);
      return await this.kdsOrdenesRepository.findOne({ where: { id } });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al actualizar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPantalla(destino_id: number) {
    try {
      const rows = await this.kdsOrdenesRepository
        .createQueryBuilder('k')
        .leftJoinAndSelect('k.orden_linea', 'ol')
        .leftJoinAndSelect('ol.articulo', 'art')
        .leftJoinAndSelect('art.familia', 'fam')
        .leftJoinAndSelect('ol.orden', 'ord')
        .leftJoinAndSelect('ord.mesa', 'mesa')
        .where('k.destino_id = :destino_id', { destino_id })
        .andWhere('k.estado IN (:...estados)', { estados: ['pendiente', 'en_preparacion'] })
        .orderBy('k.tiempo_recibido', 'ASC')
        .getMany();

      // Cargar modificadores para todas las líneas de una vez
      const lineaIds = rows.map(k => k.orden_linea?.id).filter(Boolean) as number[];
      const mods = lineaIds.length
        ? await this.modificadoresRepo
            .createQueryBuilder('m')
            .leftJoinAndSelect('m.modificador', 'mod')
            .where('m.orden_linea_id IN (:...ids)', { ids: lineaIds })
            .getMany()
        : [];
      const modsByLinea = new Map<number, string[]>();
      for (const m of mods) {
        const nombre = m.modificador?.nombre ?? '';
        if (!nombre) continue;
        const list = modsByLinea.get(m.orden_linea_id) ?? [];
        list.push(nombre);
        modsByLinea.set(m.orden_linea_id, list);
      }

      // Agrupar por batch: (orden_id + tiempo_recibido) — cada envío a cocina es una tarjeta separada
      const map = new Map<string, any>();
      for (const k of rows) {
        const ord = k.orden_linea?.orden;
        const ol  = k.orden_linea;
        const ordenId  = ord?.id ?? 0;
        const batchKey = `${ordenId}_${k.tiempo_recibido instanceof Date ? k.tiempo_recibido.toISOString() : k.tiempo_recibido}`;
        if (!map.has(batchKey)) {
          map.set(batchKey, {
            kds_orden_id:    k.id,
            orden_id:        ordenId,
            numero_orden:    ord?.numero_orden ?? 0,
            mesa:            ord?.mesa?.nombre ?? `Orden ${ord?.numero_orden}`,
            tipo_servicio:   ord?.tipo_servicio ?? 'mesa',
            tiempo_recibido: k.tiempo_recibido,
            estado:          k.estado,
            lineas: [],
          });
        }
        map.get(batchKey).lineas.push({
          kds_orden_id:       k.id,
          orden_linea_id:     ol?.id,
          articulo:           ol?.articulo?.nombre ?? '',
          cantidad:           ol?.cantidad ?? 1,
          modificadores:      modsByLinea.get(ol?.id as number) ?? [],
          notas_linea:        ol?.notas_linea ?? '',
          tiempo_preparacion: ol?.articulo?.tiempo_preparacion ?? null,
          estado:             k.estado,
        });
      }
      return Array.from(map.values());
    } catch (error: unknown) {
      throw new HttpException(
        `Error al obtener pantalla KDS: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.kdsOrdenesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`KdsOrdene con ID ${id} no encontrado`);
      }
      await this.kdsOrdenesRepository.delete(id);
      return { message: `KdsOrdene con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelarPorLinea(lineaId: number): Promise<void> {
    await this.kdsOrdenesRepository.update(
      { orden_linea_id: lineaId },
      { estado: 'cancelada' },
    );
  }

  private applyFilters(
    qb: SelectQueryBuilder<KdsOrdene>,
    filters: Partial<KdsOrdeneFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('kdsOrdene.id = :id', { id: filters.id });
    }
    if (filters.orden_linea_id !== undefined) {
      qb.andWhere('kdsOrdene.orden_linea_id = :orden_linea_id', { orden_linea_id: filters.orden_linea_id });
    }
    if (filters.destino_id !== undefined) {
      qb.andWhere('kdsOrdene.destino_id = :destino_id', { destino_id: filters.destino_id });
    }
    if (filters.estado) {
      qb.andWhere('kdsOrdene.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.tiempo_recibido) {
      qb.andWhere('kdsOrdene.tiempo_recibido = :tiempo_recibido', { tiempo_recibido: filters.tiempo_recibido });
    }
    if (filters.tiempo_preparado) {
      qb.andWhere('kdsOrdene.tiempo_preparado = :tiempo_preparado', { tiempo_preparado: filters.tiempo_preparado });
    }
  }

  private applySorting(qb: SelectQueryBuilder<KdsOrdene>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'orden_linea_id', 'destino_id', 'estado', 'tiempo_recibido', 'tiempo_preparado'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`kdsOrdene.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('kdsOrdene.id', 'DESC');
  }
}

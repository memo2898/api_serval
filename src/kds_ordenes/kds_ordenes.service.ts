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

@Injectable()
export class KdsOrdenesService {
  constructor(
    @InjectRepository(KdsOrdene)
    private kdsOrdenesRepository: Repository<KdsOrdene>,
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

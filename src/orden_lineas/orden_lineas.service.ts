import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateOrdenLineaDto } from './dto/create-orden_linea.dto';
import { UpdateOrdenLineaDto } from './dto/update-orden_linea.dto';
import { OrdenLineaFiltersDto } from './dto/pagination.dto';
import { OrdenLinea } from './entities/orden_linea.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class OrdenLineasService {
  constructor(
    @InjectRepository(OrdenLinea)
    private ordenLineasRepository: Repository<OrdenLinea>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateOrdenLineaDto) {
    try {
      const record = this.ordenLineasRepository.create(dto);
      return await this.ordenLineasRepository.save(record);
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
    filters: OrdenLineaFiltersDto,
  ): Promise<OrdenLinea[] | PaginationResponse<OrdenLinea>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.ordenLineasRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.ordenLineasRepository.createQueryBuilder('ordenLinea');
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
      const record = await this.ordenLineasRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`OrdenLinea con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateOrdenLineaDto) {
    try {
      const existing = await this.ordenLineasRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`OrdenLinea con ID ${id} no encontrado`);
      }
      await this.ordenLineasRepository.update(id, dto);
      return await this.ordenLineasRepository.findOne({ where: { id } });
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
      const existing = await this.ordenLineasRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`OrdenLinea con ID ${id} no encontrado`);
      }
      await this.ordenLineasRepository.delete(id);
      return { message: `OrdenLinea con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<OrdenLinea>,
    filters: Partial<OrdenLineaFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('ordenLinea.id = :id', { id: filters.id });
    }
    if (filters.orden_id !== undefined) {
      qb.andWhere('ordenLinea.orden_id = :orden_id', { orden_id: filters.orden_id });
    }
    if (filters.articulo_id !== undefined) {
      qb.andWhere('ordenLinea.articulo_id = :articulo_id', { articulo_id: filters.articulo_id });
    }
    if (filters.cantidad !== undefined) {
      qb.andWhere('ordenLinea.cantidad = :cantidad', { cantidad: filters.cantidad });
    }
    if (filters.precio_unitario !== undefined) {
      qb.andWhere('ordenLinea.precio_unitario = :precio_unitario', { precio_unitario: filters.precio_unitario });
    }
    if (filters.descuento_linea !== undefined) {
      qb.andWhere('ordenLinea.descuento_linea = :descuento_linea', { descuento_linea: filters.descuento_linea });
    }
    if (filters.impuesto_linea !== undefined) {
      qb.andWhere('ordenLinea.impuesto_linea = :impuesto_linea', { impuesto_linea: filters.impuesto_linea });
    }
    if (filters.subtotal_linea !== undefined) {
      qb.andWhere('ordenLinea.subtotal_linea = :subtotal_linea', { subtotal_linea: filters.subtotal_linea });
    }
    if (filters.estado) {
      qb.andWhere('ordenLinea.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.enviado_a_cocina !== undefined) {
      qb.andWhere('ordenLinea.enviado_a_cocina = :enviado_a_cocina', { enviado_a_cocina: filters.enviado_a_cocina });
    }
    if (filters.fecha_envio) {
      qb.andWhere('ordenLinea.fecha_envio = :fecha_envio', { fecha_envio: filters.fecha_envio });
    }
    if (filters.notas_linea) {
      qb.andWhere('ordenLinea.notas_linea LIKE :notas_linea', { notas_linea: `%${filters.notas_linea}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('ordenLinea.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('ordenLinea.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('ordenLinea.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('ordenLinea.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<OrdenLinea>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'orden_id', 'articulo_id', 'cantidad', 'precio_unitario', 'descuento_linea', 'impuesto_linea', 'subtotal_linea', 'estado', 'enviado_a_cocina', 'fecha_envio', 'notas_linea', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`ordenLinea.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('ordenLinea.agregado_en', 'DESC');
  }
}

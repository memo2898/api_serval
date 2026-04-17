import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateFormasPagoDto } from './dto/create-formas_pago.dto';
import { UpdateFormasPagoDto } from './dto/update-formas_pago.dto';
import { FormasPagoFiltersDto } from './dto/pagination.dto';
import { FormasPago } from './entities/formas_pago.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class FormasPagoService {
  constructor(
    @InjectRepository(FormasPago)
    private formasPagoRepository: Repository<FormasPago>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateFormasPagoDto) {
    try {
      const record = this.formasPagoRepository.create(dto);
      return await this.formasPagoRepository.save(record);
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
    filters: FormasPagoFiltersDto,
  ): Promise<FormasPago[] | PaginationResponse<FormasPago>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.formasPagoRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.formasPagoRepository.createQueryBuilder('formasPago');
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
      const record = await this.formasPagoRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`FormasPago con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateFormasPagoDto) {
    try {
      const existing = await this.formasPagoRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`FormasPago con ID ${id} no encontrado`);
      }
      await this.formasPagoRepository.update(id, dto);
      return await this.formasPagoRepository.findOne({ where: { id } });
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
      const existing = await this.formasPagoRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`FormasPago con ID ${id} no encontrado`);
      }
      await this.formasPagoRepository.delete(id);
      return { message: `FormasPago con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<FormasPago>,
    filters: Partial<FormasPagoFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('formasPago.id = :id', { id: filters.id });
    }
    if (filters.sucursal_id !== undefined) {
      qb.andWhere('formasPago.sucursal_id = :sucursal_id', { sucursal_id: filters.sucursal_id });
    }
    if (filters.nombre) {
      qb.andWhere('formasPago.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.tipo) {
      qb.andWhere('formasPago.tipo LIKE :tipo', { tipo: `%${filters.tipo}%` });
    }
    if (filters.requiere_referencia !== undefined) {
      qb.andWhere('formasPago.requiere_referencia = :requiere_referencia', { requiere_referencia: filters.requiere_referencia });
    }
    if (filters.estado) {
      qb.andWhere('formasPago.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('formasPago.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('formasPago.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('formasPago.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('formasPago.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<FormasPago>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'sucursal_id', 'nombre', 'tipo', 'requiere_referencia', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`formasPago.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('formasPago.agregado_en', 'DESC');
  }
}

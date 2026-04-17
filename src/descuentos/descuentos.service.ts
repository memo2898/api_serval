import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { DescuentoFiltersDto } from './dto/pagination.dto';
import { Descuento } from './entities/descuento.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class DescuentosService {
  constructor(
    @InjectRepository(Descuento)
    private descuentosRepository: Repository<Descuento>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateDescuentoDto) {
    try {
      const record = this.descuentosRepository.create(dto);
      return await this.descuentosRepository.save(record);
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
    filters: DescuentoFiltersDto,
  ): Promise<Descuento[] | PaginationResponse<Descuento>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.descuentosRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.descuentosRepository.createQueryBuilder('descuento');
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
      const record = await this.descuentosRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Descuento con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateDescuentoDto) {
    try {
      const existing = await this.descuentosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Descuento con ID ${id} no encontrado`);
      }
      await this.descuentosRepository.update(id, dto);
      return await this.descuentosRepository.findOne({ where: { id } });
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
      const existing = await this.descuentosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Descuento con ID ${id} no encontrado`);
      }
      await this.descuentosRepository.delete(id);
      return { message: `Descuento con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Descuento>,
    filters: Partial<DescuentoFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('descuento.id = :id', { id: filters.id });
    }
    if (filters.sucursal_id !== undefined) {
      qb.andWhere('descuento.sucursal_id = :sucursal_id', { sucursal_id: filters.sucursal_id });
    }
    if (filters.nombre) {
      qb.andWhere('descuento.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.tipo) {
      qb.andWhere('descuento.tipo LIKE :tipo', { tipo: `%${filters.tipo}%` });
    }
    if (filters.valor !== undefined) {
      qb.andWhere('descuento.valor = :valor', { valor: filters.valor });
    }
    if (filters.aplica_a) {
      qb.andWhere('descuento.aplica_a LIKE :aplica_a', { aplica_a: `%${filters.aplica_a}%` });
    }
    if (filters.requiere_autorizacion !== undefined) {
      qb.andWhere('descuento.requiere_autorizacion = :requiere_autorizacion', { requiere_autorizacion: filters.requiere_autorizacion });
    }
    if (filters.fecha_inicio) {
      qb.andWhere('descuento.fecha_inicio = :fecha_inicio', { fecha_inicio: filters.fecha_inicio });
    }
    if (filters.fecha_fin) {
      qb.andWhere('descuento.fecha_fin = :fecha_fin', { fecha_fin: filters.fecha_fin });
    }
    if (filters.estado) {
      qb.andWhere('descuento.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('descuento.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('descuento.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('descuento.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('descuento.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Descuento>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'sucursal_id', 'nombre', 'tipo', 'valor', 'aplica_a', 'requiere_autorizacion', 'fecha_inicio', 'fecha_fin', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`descuento.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('descuento.agregado_en', 'DESC');
  }
}

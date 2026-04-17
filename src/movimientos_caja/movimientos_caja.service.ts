import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateMovimientosCajaDto } from './dto/create-movimientos_caja.dto';
import { UpdateMovimientosCajaDto } from './dto/update-movimientos_caja.dto';
import { MovimientosCajaFiltersDto } from './dto/pagination.dto';
import { MovimientosCaja } from './entities/movimientos_caja.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class MovimientosCajaService {
  constructor(
    @InjectRepository(MovimientosCaja)
    private movimientosCajaRepository: Repository<MovimientosCaja>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateMovimientosCajaDto) {
    try {
      const record = this.movimientosCajaRepository.create(dto);
      return await this.movimientosCajaRepository.save(record);
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
    filters: MovimientosCajaFiltersDto,
  ): Promise<MovimientosCaja[] | PaginationResponse<MovimientosCaja>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.movimientosCajaRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.movimientosCajaRepository.createQueryBuilder('movimientosCaja');
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
      const record = await this.movimientosCajaRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`MovimientosCaja con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateMovimientosCajaDto) {
    try {
      const existing = await this.movimientosCajaRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`MovimientosCaja con ID ${id} no encontrado`);
      }
      await this.movimientosCajaRepository.update(id, dto);
      return await this.movimientosCajaRepository.findOne({ where: { id } });
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
      const existing = await this.movimientosCajaRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`MovimientosCaja con ID ${id} no encontrado`);
      }
      await this.movimientosCajaRepository.delete(id);
      return { message: `MovimientosCaja con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<MovimientosCaja>,
    filters: Partial<MovimientosCajaFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('movimientosCaja.id = :id', { id: filters.id });
    }
    if (filters.turno_id !== undefined) {
      qb.andWhere('movimientosCaja.turno_id = :turno_id', { turno_id: filters.turno_id });
    }
    if (filters.tipo) {
      qb.andWhere('movimientosCaja.tipo LIKE :tipo', { tipo: `%${filters.tipo}%` });
    }
    if (filters.monto !== undefined) {
      qb.andWhere('movimientosCaja.monto = :monto', { monto: filters.monto });
    }
    if (filters.concepto) {
      qb.andWhere('movimientosCaja.concepto LIKE :concepto', { concepto: `%${filters.concepto}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('movimientosCaja.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('movimientosCaja.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<MovimientosCaja>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'turno_id', 'tipo', 'monto', 'concepto', 'agregado_en', 'agregado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`movimientosCaja.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('movimientosCaja.agregado_en', 'DESC');
  }
}

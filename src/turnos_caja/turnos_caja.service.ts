import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateTurnosCajaDto } from './dto/create-turnos_caja.dto';
import { UpdateTurnosCajaDto } from './dto/update-turnos_caja.dto';
import { TurnosCajaFiltersDto } from './dto/pagination.dto';
import { TurnosCaja } from './entities/turnos_caja.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class TurnosCajaService {
  constructor(
    @InjectRepository(TurnosCaja)
    private turnosCajaRepository: Repository<TurnosCaja>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateTurnosCajaDto) {
    try {
      const record = this.turnosCajaRepository.create(dto);
      return await this.turnosCajaRepository.save(record);
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
    filters: TurnosCajaFiltersDto,
  ): Promise<TurnosCaja[] | PaginationResponse<TurnosCaja>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.turnosCajaRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.turnosCajaRepository.createQueryBuilder('turnosCaja');
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
      const record = await this.turnosCajaRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`TurnosCaja con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateTurnosCajaDto) {
    try {
      const existing = await this.turnosCajaRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`TurnosCaja con ID ${id} no encontrado`);
      }
      await this.turnosCajaRepository.update(id, dto);
      return await this.turnosCajaRepository.findOne({ where: { id } });
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
      const existing = await this.turnosCajaRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`TurnosCaja con ID ${id} no encontrado`);
      }
      await this.turnosCajaRepository.delete(id);
      return { message: `TurnosCaja con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<TurnosCaja>,
    filters: Partial<TurnosCajaFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('turnosCaja.id = :id', { id: filters.id });
    }
    if (filters.terminal_id !== undefined) {
      qb.andWhere('turnosCaja.terminal_id = :terminal_id', { terminal_id: filters.terminal_id });
    }
    if (filters.usuario_id !== undefined) {
      qb.andWhere('turnosCaja.usuario_id = :usuario_id', { usuario_id: filters.usuario_id });
    }
    if (filters.fecha_apertura) {
      qb.andWhere('turnosCaja.fecha_apertura = :fecha_apertura', { fecha_apertura: filters.fecha_apertura });
    }
    if (filters.fecha_cierre) {
      qb.andWhere('turnosCaja.fecha_cierre = :fecha_cierre', { fecha_cierre: filters.fecha_cierre });
    }
    if (filters.monto_apertura !== undefined) {
      qb.andWhere('turnosCaja.monto_apertura = :monto_apertura', { monto_apertura: filters.monto_apertura });
    }
    if (filters.monto_cierre_declarado !== undefined) {
      qb.andWhere('turnosCaja.monto_cierre_declarado = :monto_cierre_declarado', { monto_cierre_declarado: filters.monto_cierre_declarado });
    }
    if (filters.monto_cierre_real !== undefined) {
      qb.andWhere('turnosCaja.monto_cierre_real = :monto_cierre_real', { monto_cierre_real: filters.monto_cierre_real });
    }
    if (filters.estado) {
      qb.andWhere('turnosCaja.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('turnosCaja.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('turnosCaja.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('turnosCaja.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('turnosCaja.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<TurnosCaja>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'terminal_id', 'usuario_id', 'fecha_apertura', 'fecha_cierre', 'monto_apertura', 'monto_cierre_declarado', 'monto_cierre_real', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`turnosCaja.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('turnosCaja.agregado_en', 'DESC');
  }
}

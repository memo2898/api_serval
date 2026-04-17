import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateReservacioneDto } from './dto/create-reservacione.dto';
import { UpdateReservacioneDto } from './dto/update-reservacione.dto';
import { ReservacioneFiltersDto } from './dto/pagination.dto';
import { Reservacione } from './entities/reservacione.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class ReservacionesService {
  constructor(
    @InjectRepository(Reservacione)
    private reservacionesRepository: Repository<Reservacione>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateReservacioneDto) {
    try {
      const record = this.reservacionesRepository.create(dto);
      return await this.reservacionesRepository.save(record);
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
    filters: ReservacioneFiltersDto,
  ): Promise<Reservacione[] | PaginationResponse<Reservacione>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.reservacionesRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.reservacionesRepository.createQueryBuilder('reservacione');
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
      const record = await this.reservacionesRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Reservacione con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateReservacioneDto) {
    try {
      const existing = await this.reservacionesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Reservacione con ID ${id} no encontrado`);
      }
      await this.reservacionesRepository.update(id, dto);
      return await this.reservacionesRepository.findOne({ where: { id } });
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
      const existing = await this.reservacionesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Reservacione con ID ${id} no encontrado`);
      }
      await this.reservacionesRepository.delete(id);
      return { message: `Reservacione con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Reservacione>,
    filters: Partial<ReservacioneFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('reservacione.id = :id', { id: filters.id });
    }
    if (filters.sucursal_id !== undefined) {
      qb.andWhere('reservacione.sucursal_id = :sucursal_id', { sucursal_id: filters.sucursal_id });
    }
    if (filters.mesa_id !== undefined) {
      qb.andWhere('reservacione.mesa_id = :mesa_id', { mesa_id: filters.mesa_id });
    }
    if (filters.cliente_id !== undefined) {
      qb.andWhere('reservacione.cliente_id = :cliente_id', { cliente_id: filters.cliente_id });
    }
    if (filters.nombre_contacto) {
      qb.andWhere('reservacione.nombre_contacto LIKE :nombre_contacto', { nombre_contacto: `%${filters.nombre_contacto}%` });
    }
    if (filters.telefono) {
      qb.andWhere('reservacione.telefono LIKE :telefono', { telefono: `%${filters.telefono}%` });
    }
    if (filters.fecha_hora) {
      qb.andWhere('reservacione.fecha_hora = :fecha_hora', { fecha_hora: filters.fecha_hora });
    }
    if (filters.duracion_min !== undefined) {
      qb.andWhere('reservacione.duracion_min = :duracion_min', { duracion_min: filters.duracion_min });
    }
    if (filters.num_personas !== undefined) {
      qb.andWhere('reservacione.num_personas = :num_personas', { num_personas: filters.num_personas });
    }
    if (filters.estado) {
      qb.andWhere('reservacione.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.notas) {
      qb.andWhere('reservacione.notas LIKE :notas', { notas: `%${filters.notas}%` });
    }
    if (filters.cancelada_en) {
      qb.andWhere('reservacione.cancelada_en = :cancelada_en', { cancelada_en: filters.cancelada_en });
    }
    if (filters.cancelada_por !== undefined) {
      qb.andWhere('reservacione.cancelada_por = :cancelada_por', { cancelada_por: filters.cancelada_por });
    }
    if (filters.motivo_cancelacion) {
      qb.andWhere('reservacione.motivo_cancelacion LIKE :motivo_cancelacion', { motivo_cancelacion: `%${filters.motivo_cancelacion}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('reservacione.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('reservacione.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('reservacione.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('reservacione.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Reservacione>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'sucursal_id', 'mesa_id', 'cliente_id', 'nombre_contacto', 'telefono', 'fecha_hora', 'duracion_min', 'num_personas', 'estado', 'notas', 'cancelada_en', 'cancelada_por', 'motivo_cancelacion', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`reservacione.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('reservacione.agregado_en', 'DESC');
  }
}

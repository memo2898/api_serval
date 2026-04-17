import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { MesaFiltersDto } from './dto/pagination.dto';
import { Mesa } from './entities/mesa.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private mesasRepository: Repository<Mesa>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateMesaDto) {
    try {
      const record = this.mesasRepository.create(dto);
      return await this.mesasRepository.save(record);
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
    filters: MesaFiltersDto,
  ): Promise<Mesa[] | PaginationResponse<Mesa>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.mesasRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.mesasRepository.createQueryBuilder('mesa');
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
      const record = await this.mesasRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Mesa con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateMesaDto) {
    try {
      const existing = await this.mesasRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Mesa con ID ${id} no encontrado`);
      }
      await this.mesasRepository.update(id, dto);
      return await this.mesasRepository.findOne({ where: { id } });
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
      const existing = await this.mesasRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Mesa con ID ${id} no encontrado`);
      }
      await this.mesasRepository.delete(id);
      return { message: `Mesa con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Mesa>,
    filters: Partial<MesaFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('mesa.id = :id', { id: filters.id });
    }
    if (filters.zona_id !== undefined) {
      qb.andWhere('mesa.zona_id = :zona_id', { zona_id: filters.zona_id });
    }
    if (filters.nombre) {
      qb.andWhere('mesa.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.capacidad !== undefined) {
      qb.andWhere('mesa.capacidad = :capacidad', { capacidad: filters.capacidad });
    }
    if (filters.posicion_x !== undefined) {
      qb.andWhere('mesa.posicion_x = :posicion_x', { posicion_x: filters.posicion_x });
    }
    if (filters.posicion_y !== undefined) {
      qb.andWhere('mesa.posicion_y = :posicion_y', { posicion_y: filters.posicion_y });
    }
    if (filters.estado) {
      qb.andWhere('mesa.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('mesa.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('mesa.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('mesa.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('mesa.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Mesa>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'zona_id', 'nombre', 'capacidad', 'posicion_x', 'posicion_y', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`mesa.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('mesa.agregado_en', 'DESC');
  }
}

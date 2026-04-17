import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateFamiliaDto } from './dto/create-familia.dto';
import { UpdateFamiliaDto } from './dto/update-familia.dto';
import { FamiliaFiltersDto } from './dto/pagination.dto';
import { Familia } from './entities/familia.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class FamiliasService {
  constructor(
    @InjectRepository(Familia)
    private familiasRepository: Repository<Familia>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateFamiliaDto) {
    try {
      const record = this.familiasRepository.create(dto);
      return await this.familiasRepository.save(record);
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
    filters: FamiliaFiltersDto,
  ): Promise<Familia[] | PaginationResponse<Familia>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.familiasRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.familiasRepository.createQueryBuilder('familia');
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
      const record = await this.familiasRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Familia con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateFamiliaDto) {
    try {
      const existing = await this.familiasRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Familia con ID ${id} no encontrado`);
      }
      await this.familiasRepository.update(id, dto);
      return await this.familiasRepository.findOne({ where: { id } });
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
      const existing = await this.familiasRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Familia con ID ${id} no encontrado`);
      }
      await this.familiasRepository.delete(id);
      return { message: `Familia con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Familia>,
    filters: Partial<FamiliaFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('familia.id = :id', { id: filters.id });
    }
    if (filters.sucursal_id !== undefined) {
      qb.andWhere('familia.sucursal_id = :sucursal_id', { sucursal_id: filters.sucursal_id });
    }
    if (filters.nombre) {
      qb.andWhere('familia.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.color) {
      qb.andWhere('familia.color LIKE :color', { color: `%${filters.color}%` });
    }
    if (filters.icono) {
      qb.andWhere('familia.icono LIKE :icono', { icono: `%${filters.icono}%` });
    }
    if (filters.orden_visual !== undefined) {
      qb.andWhere('familia.orden_visual = :orden_visual', { orden_visual: filters.orden_visual });
    }
    if (filters.destino_impresion) {
      qb.andWhere('familia.destino_impresion LIKE :destino_impresion', { destino_impresion: `%${filters.destino_impresion}%` });
    }
    if (filters.estado) {
      qb.andWhere('familia.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('familia.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('familia.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('familia.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('familia.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Familia>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'sucursal_id', 'nombre', 'color', 'icono', 'orden_visual', 'destino_impresion', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`familia.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('familia.agregado_en', 'DESC');
  }
}

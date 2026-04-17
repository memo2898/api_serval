import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateGruposModificadoreDto } from './dto/create-grupos_modificadore.dto';
import { UpdateGruposModificadoreDto } from './dto/update-grupos_modificadore.dto';
import { GruposModificadoreFiltersDto } from './dto/pagination.dto';
import { GruposModificadore } from './entities/grupos_modificadore.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class GruposModificadoresService {
  constructor(
    @InjectRepository(GruposModificadore)
    private gruposModificadoresRepository: Repository<GruposModificadore>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateGruposModificadoreDto) {
    try {
      const record = this.gruposModificadoresRepository.create(dto);
      return await this.gruposModificadoresRepository.save(record);
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
    filters: GruposModificadoreFiltersDto,
  ): Promise<GruposModificadore[] | PaginationResponse<GruposModificadore>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.gruposModificadoresRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.gruposModificadoresRepository.createQueryBuilder('gruposModificadore');
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
      const record = await this.gruposModificadoresRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`GruposModificadore con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateGruposModificadoreDto) {
    try {
      const existing = await this.gruposModificadoresRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`GruposModificadore con ID ${id} no encontrado`);
      }
      await this.gruposModificadoresRepository.update(id, dto);
      return await this.gruposModificadoresRepository.findOne({ where: { id } });
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
      const existing = await this.gruposModificadoresRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`GruposModificadore con ID ${id} no encontrado`);
      }
      await this.gruposModificadoresRepository.delete(id);
      return { message: `GruposModificadore con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<GruposModificadore>,
    filters: Partial<GruposModificadoreFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('gruposModificadore.id = :id', { id: filters.id });
    }
    if (filters.nombre) {
      qb.andWhere('gruposModificadore.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.tipo) {
      qb.andWhere('gruposModificadore.tipo LIKE :tipo', { tipo: `%${filters.tipo}%` });
    }
    if (filters.seleccion) {
      qb.andWhere('gruposModificadore.seleccion LIKE :seleccion', { seleccion: `%${filters.seleccion}%` });
    }
    if (filters.obligatorio !== undefined) {
      qb.andWhere('gruposModificadore.obligatorio = :obligatorio', { obligatorio: filters.obligatorio });
    }
    if (filters.min_seleccion !== undefined) {
      qb.andWhere('gruposModificadore.min_seleccion = :min_seleccion', { min_seleccion: filters.min_seleccion });
    }
    if (filters.max_seleccion !== undefined) {
      qb.andWhere('gruposModificadore.max_seleccion = :max_seleccion', { max_seleccion: filters.max_seleccion });
    }
    if (filters.estado) {
      qb.andWhere('gruposModificadore.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('gruposModificadore.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('gruposModificadore.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('gruposModificadore.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('gruposModificadore.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<GruposModificadore>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'nombre', 'tipo', 'seleccion', 'obligatorio', 'min_seleccion', 'max_seleccion', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`gruposModificadore.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('gruposModificadore.agregado_en', 'DESC');
  }
}

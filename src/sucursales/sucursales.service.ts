import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateSucursaleDto } from './dto/create-sucursale.dto';
import { UpdateSucursaleDto } from './dto/update-sucursale.dto';
import { SucursaleFiltersDto } from './dto/pagination.dto';
import { Sucursale } from './entities/sucursale.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursale)
    private sucursalesRepository: Repository<Sucursale>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateSucursaleDto) {
    try {
      const record = this.sucursalesRepository.create(dto);
      return await this.sucursalesRepository.save(record);
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
    filters: SucursaleFiltersDto,
  ): Promise<Sucursale[] | PaginationResponse<Sucursale>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.sucursalesRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.sucursalesRepository.createQueryBuilder('sucursale');
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
      const record = await this.sucursalesRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Sucursale con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateSucursaleDto) {
    try {
      const existing = await this.sucursalesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Sucursale con ID ${id} no encontrado`);
      }
      await this.sucursalesRepository.update(id, dto);
      return await this.sucursalesRepository.findOne({ where: { id } });
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
      const existing = await this.sucursalesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Sucursale con ID ${id} no encontrado`);
      }
      await this.sucursalesRepository.delete(id);
      return { message: `Sucursale con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Sucursale>,
    filters: Partial<SucursaleFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('sucursale.id = :id', { id: filters.id });
    }
    if (filters.empresa_id !== undefined) {
      qb.andWhere('sucursale.empresa_id = :empresa_id', { empresa_id: filters.empresa_id });
    }
    if (filters.nombre) {
      qb.andWhere('sucursale.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.direccion) {
      qb.andWhere('sucursale.direccion LIKE :direccion', { direccion: `%${filters.direccion}%` });
    }
    if (filters.telefono) {
      qb.andWhere('sucursale.telefono LIKE :telefono', { telefono: `%${filters.telefono}%` });
    }
    if (filters.estado) {
      qb.andWhere('sucursale.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('sucursale.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('sucursale.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('sucursale.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('sucursale.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Sucursale>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'empresa_id', 'nombre', 'direccion', 'telefono', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`sucursale.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('sucursale.agregado_en', 'DESC');
  }
}

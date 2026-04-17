import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { PermisoFiltersDto } from './dto/pagination.dto';
import { Permiso } from './entities/permiso.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private permisosRepository: Repository<Permiso>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreatePermisoDto) {
    try {
      const record = this.permisosRepository.create(dto);
      return await this.permisosRepository.save(record);
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
    filters: PermisoFiltersDto,
  ): Promise<Permiso[] | PaginationResponse<Permiso>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.permisosRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.permisosRepository.createQueryBuilder('permiso');
      this.applyFilters(qb, filterParams);
      this.applySorting(qb, sort);

      if (page !== undefined && limit !== undefined) {
        const p = Number(page);
        const l = Number(limit);
        const [data, total] = await qb
          .skip((p - 1) * l)
          .take(l)
          .getManyAndCount();
        const totalPages = Math.ceil(total / l);
        return {
          data,
          meta: {
            total,
            page: p,
            limit: l,
            totalPages,
            hasNext: p < totalPages,
            hasPrev: p > 1,
          },
        };
      }

      const data = await qb.getMany();
      return {
        data,
        meta: {
          total: data.length,
          page: 1,
          limit: data.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
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
      const record = await this.permisosRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdatePermisoDto) {
    try {
      const existing = await this.permisosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
      }
      await this.permisosRepository.update(id, dto);
      return await this.permisosRepository.findOne({ where: { id } });
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
      const existing = await this.permisosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
      }
      await this.permisosRepository.delete(id);
      return { message: `Permiso con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Permiso>,
    filters: Partial<PermisoFiltersDto>,
  ) {
    if (filters.id !== undefined) {
      qb.andWhere('permiso.id = :id', { id: filters.id });
    }
    if (filters.codigo) {
      qb.andWhere('permiso.codigo LIKE :codigo', {
        codigo: `%${filters.codigo}%`,
      });
    }
    if (filters.descripcion) {
      qb.andWhere('permiso.descripcion LIKE :descripcion', {
        descripcion: `%${filters.descripcion}%`,
      });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Permiso>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'codigo', 'descripcion'];
      if (
        validFields.includes(field) &&
        ['ASC', 'DESC'].includes(direction?.toUpperCase())
      ) {
        qb.orderBy(
          `permiso.${field}`,
          direction.toUpperCase() as 'ASC' | 'DESC',
        );
        return;
      }
    }
    qb.orderBy('permiso.id', 'DESC');
  }
}

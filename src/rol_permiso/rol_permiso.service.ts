import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRolPermisoDto } from './dto/create-rol_permiso.dto';
import { UpdateRolPermisoDto } from './dto/update-rol_permiso.dto';
import { RolPermisoFiltersDto } from './dto/pagination.dto';
import { RolPermiso } from './entities/rol_permiso.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class RolPermisoService {
  constructor(
    @InjectRepository(RolPermiso)
    private rolPermisoRepository: Repository<RolPermiso>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateRolPermisoDto) {
    try {
      const record = this.rolPermisoRepository.create(dto);
      return await this.rolPermisoRepository.save(record);
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
    filters: RolPermisoFiltersDto,
  ): Promise<RolPermiso[] | PaginationResponse<RolPermiso>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.rolPermisoRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.rolPermisoRepository.createQueryBuilder('rolPermiso');
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

  async findOne(rol_id: number, permiso_id: number) {
    try {
      const record = await this.rolPermisoRepository.findOne({ where: { rol_id, permiso_id } });
      if (!record) {
        throw new NotFoundException(`RolPermiso con ID ${rol_id}/${permiso_id} no encontrado`);
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

  async update(rol_id: number, permiso_id: number, dto: UpdateRolPermisoDto) {
    try {
      const existing = await this.rolPermisoRepository.findOne({ where: { rol_id, permiso_id } });
      if (!existing) {
        throw new NotFoundException(`RolPermiso con ID ${rol_id}/${permiso_id} no encontrado`);
      }
      await this.rolPermisoRepository.update({ rol_id, permiso_id }, dto);
      return await this.rolPermisoRepository.findOne({ where: { rol_id, permiso_id } });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al actualizar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(rol_id: number, permiso_id: number) {
    try {
      const existing = await this.rolPermisoRepository.findOne({ where: { rol_id, permiso_id } });
      if (!existing) {
        throw new NotFoundException(`RolPermiso con ID ${rol_id}/${permiso_id} no encontrado`);
      }
      await this.rolPermisoRepository.delete({ rol_id, permiso_id });
      return { message: `RolPermiso con ID ${rol_id}/${permiso_id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<RolPermiso>,
    filters: Partial<RolPermisoFiltersDto>,
  ) {
    
    if (filters.rol_id !== undefined) {
      qb.andWhere('rolPermiso.rol_id = :rol_id', { rol_id: filters.rol_id });
    }
    if (filters.permiso_id !== undefined) {
      qb.andWhere('rolPermiso.permiso_id = :permiso_id', { permiso_id: filters.permiso_id });
    }
  }

  private applySorting(qb: SelectQueryBuilder<RolPermiso>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['rol_id', 'permiso_id'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`rolPermiso.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('rolPermiso.rol_id', 'ASC');
  }
}

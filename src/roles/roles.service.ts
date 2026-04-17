import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleFiltersDto } from './dto/pagination.dto';
import { Role } from './entities/role.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateRoleDto) {
    try {
      const record = this.rolesRepository.create(dto);
      return await this.rolesRepository.save(record);
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
    filters: RoleFiltersDto,
  ): Promise<Role[] | PaginationResponse<Role>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.rolesRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.rolesRepository.createQueryBuilder('role');
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
      const record = await this.rolesRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Role con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateRoleDto) {
    try {
      const existing = await this.rolesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Role con ID ${id} no encontrado`);
      }
      await this.rolesRepository.update(id, dto);
      return await this.rolesRepository.findOne({ where: { id } });
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
      const existing = await this.rolesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Role con ID ${id} no encontrado`);
      }
      await this.rolesRepository.delete(id);
      return { message: `Role con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Role>,
    filters: Partial<RoleFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('role.id = :id', { id: filters.id });
    }
    if (filters.nombre) {
      qb.andWhere('role.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.descripcion) {
      qb.andWhere('role.descripcion LIKE :descripcion', { descripcion: `%${filters.descripcion}%` });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Role>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'nombre', 'descripcion'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`role.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('role.id', 'DESC');
  }
}

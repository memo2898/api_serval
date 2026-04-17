import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUsuarioRolDto } from './dto/create-usuario_rol.dto';
import { UpdateUsuarioRolDto } from './dto/update-usuario_rol.dto';
import { UsuarioRolFiltersDto } from './dto/pagination.dto';
import { UsuarioRol } from './entities/usuario_rol.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class UsuarioRolService {
  constructor(
    @InjectRepository(UsuarioRol)
    private usuarioRolRepository: Repository<UsuarioRol>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateUsuarioRolDto) {
    try {
      const record = this.usuarioRolRepository.create(dto);
      return await this.usuarioRolRepository.save(record);
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
    filters: UsuarioRolFiltersDto,
  ): Promise<UsuarioRol[] | PaginationResponse<UsuarioRol>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.usuarioRolRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.usuarioRolRepository.createQueryBuilder('usuarioRol');
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

  async findOne(usuario_id: number, rol_id: number) {
    try {
      const record = await this.usuarioRolRepository.findOne({ where: { usuario_id, rol_id } });
      if (!record) {
        throw new NotFoundException(`UsuarioRol con ID ${usuario_id}/${rol_id} no encontrado`);
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

  async update(usuario_id: number, rol_id: number, dto: UpdateUsuarioRolDto) {
    try {
      const existing = await this.usuarioRolRepository.findOne({ where: { usuario_id, rol_id } });
      if (!existing) {
        throw new NotFoundException(`UsuarioRol con ID ${usuario_id}/${rol_id} no encontrado`);
      }
      await this.usuarioRolRepository.update({ usuario_id, rol_id }, dto);
      return await this.usuarioRolRepository.findOne({ where: { usuario_id, rol_id } });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al actualizar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(usuario_id: number, rol_id: number) {
    try {
      const existing = await this.usuarioRolRepository.findOne({ where: { usuario_id, rol_id } });
      if (!existing) {
        throw new NotFoundException(`UsuarioRol con ID ${usuario_id}/${rol_id} no encontrado`);
      }
      await this.usuarioRolRepository.delete({ usuario_id, rol_id });
      return { message: `UsuarioRol con ID ${usuario_id}/${rol_id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<UsuarioRol>,
    filters: Partial<UsuarioRolFiltersDto>,
  ) {
    if (filters.usuario_id !== undefined) {
      qb.andWhere('usuarioRol.usuario_id = :usuario_id', { usuario_id: filters.usuario_id });
    }
    if (filters.rol_id !== undefined) {
      qb.andWhere('usuarioRol.rol_id = :rol_id', { rol_id: filters.rol_id });
    }
  }

  private applySorting(qb: SelectQueryBuilder<UsuarioRol>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['usuario_id', 'rol_id'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`usuarioRol.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('usuarioRol.usuario_id', 'ASC');
  }
}

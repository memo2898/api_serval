import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioFiltersDto } from './dto/pagination.dto';
import { Usuario } from './entities/usuario.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateUsuarioDto) {
    try {
      const record = this.usuariosRepository.create(dto);
      return await this.usuariosRepository.save(record);
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
    filters: UsuarioFiltersDto,
  ): Promise<Usuario[] | PaginationResponse<Usuario>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.usuariosRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.usuariosRepository.createQueryBuilder('usuario');
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
      const record = await this.usuariosRepository.findOne({
        where: { id },
        relations: ['roles'],
      });
      if (!record) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateUsuarioDto) {
    try {
      const existing = await this.usuariosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      await this.usuariosRepository.update(id, dto);
      return await this.usuariosRepository.findOne({ where: { id } });
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
      const existing = await this.usuariosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      await this.usuariosRepository.delete(id);
      return { message: `Usuario con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Usuario>,
    filters: Partial<UsuarioFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('usuario.id = :id', { id: filters.id });
    }
    if (filters.sucursal_id !== undefined) {
      qb.andWhere('usuario.sucursal_id = :sucursal_id', { sucursal_id: filters.sucursal_id });
    }
    if (filters.rol_id !== undefined) {
      qb.andWhere('usuario.rol_id = :rol_id', { rol_id: filters.rol_id });
    }
    if (filters.nombre) {
      qb.andWhere('usuario.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.apellido) {
      qb.andWhere('usuario.apellido LIKE :apellido', { apellido: `%${filters.apellido}%` });
    }
    if (filters.email) {
      qb.andWhere('usuario.email LIKE :email', { email: `%${filters.email}%` });
    }
    if (filters.password_hash) {
      qb.andWhere('usuario.password_hash LIKE :password_hash', { password_hash: `%${filters.password_hash}%` });
    }
    if (filters.pin) {
      qb.andWhere('usuario.pin LIKE :pin', { pin: `%${filters.pin}%` });
    }
    if (filters.estado) {
      qb.andWhere('usuario.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('usuario.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('usuario.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('usuario.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('usuario.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  // ── Métodos requeridos por AuthService ─────────────────────────────

  async findByUsername(username: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  async isUserBlocked(_id: number): Promise<boolean> {
    // Sin mecanismo de bloqueo en v1 — siempre retorna false
    return false;
  }

  async registerFailedAttempt(_id: number): Promise<void> {
    // Sin contador de intentos en v1 — no-op
  }

  async updateLastAccess(_id: number): Promise<void> {
    // Sin campo last_access en v1 — no-op
  }

  // ── Sorting ─────────────────────────────────────────────────────────

  private applySorting(qb: SelectQueryBuilder<Usuario>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'sucursal_id', 'rol_id', 'nombre', 'apellido', 'email', 'password_hash', 'pin', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`usuario.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('usuario.agregado_en', 'DESC');
  }
}

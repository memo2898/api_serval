import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EmpresaFiltersDto } from './dto/pagination.dto';
import { Empresa } from './entities/empresa.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private empresasRepository: Repository<Empresa>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateEmpresaDto) {
    try {
      const record = this.empresasRepository.create(dto);
      return await this.empresasRepository.save(record);
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
    filters: EmpresaFiltersDto,
  ): Promise<Empresa[] | PaginationResponse<Empresa>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.empresasRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.empresasRepository.createQueryBuilder('empresa');
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
      const record = await this.empresasRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Empresa con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateEmpresaDto) {
    try {
      const existing = await this.empresasRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Empresa con ID ${id} no encontrado`);
      }
      await this.empresasRepository.update(id, dto);
      return await this.empresasRepository.findOne({ where: { id } });
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
      const existing = await this.empresasRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Empresa con ID ${id} no encontrado`);
      }
      await this.empresasRepository.delete(id);
      return { message: `Empresa con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Empresa>,
    filters: Partial<EmpresaFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('empresa.id = :id', { id: filters.id });
    }
    if (filters.nombre) {
      qb.andWhere('empresa.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.tipo_documento_id !== undefined) {
      qb.andWhere('empresa.tipo_documento_id = :tipo_documento_id', { tipo_documento_id: filters.tipo_documento_id });
    }
    if (filters.numero_documento) {
      qb.andWhere('empresa.numero_documento LIKE :numero_documento', { numero_documento: `%${filters.numero_documento}%` });
    }
    if (filters.logo) {
      qb.andWhere('empresa.logo LIKE :logo', { logo: `%${filters.logo}%` });
    }
    if (filters.estado) {
      qb.andWhere('empresa.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('empresa.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('empresa.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('empresa.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('empresa.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Empresa>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'nombre', 'tipo_documento_id', 'numero_documento', 'logo', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`empresa.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('empresa.agregado_en', 'DESC');
  }
}

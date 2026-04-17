import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateTipoDocumentoDto } from './dto/create-tipo_documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo_documento.dto';
import { TipoDocumentoFiltersDto } from './dto/pagination.dto';
import { TipoDocumento } from './entities/tipo_documento.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class TipoDocumentosService {
  constructor(
    @InjectRepository(TipoDocumento)
    private tipoDocumentosRepository: Repository<TipoDocumento>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateTipoDocumentoDto) {
    try {
      const record = this.tipoDocumentosRepository.create(dto);
      return await this.tipoDocumentosRepository.save(record);
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
    filters: TipoDocumentoFiltersDto,
  ): Promise<TipoDocumento[] | PaginationResponse<TipoDocumento>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.tipoDocumentosRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.tipoDocumentosRepository.createQueryBuilder('tipoDocumento');
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
      const record = await this.tipoDocumentosRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`TipoDocumento con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateTipoDocumentoDto) {
    try {
      const existing = await this.tipoDocumentosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`TipoDocumento con ID ${id} no encontrado`);
      }
      await this.tipoDocumentosRepository.update(id, dto);
      return await this.tipoDocumentosRepository.findOne({ where: { id } });
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
      const existing = await this.tipoDocumentosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`TipoDocumento con ID ${id} no encontrado`);
      }
      await this.tipoDocumentosRepository.delete(id);
      return { message: `TipoDocumento con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<TipoDocumento>,
    filters: Partial<TipoDocumentoFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('tipoDocumento.id = :id', { id: filters.id });
    }
    if (filters.tipo) {
      qb.andWhere('tipoDocumento.tipo LIKE :tipo', { tipo: `%${filters.tipo}%` });
    }
    if (filters.aplica_a) {
      qb.andWhere('tipoDocumento.aplica_a LIKE :aplica_a', { aplica_a: `%${filters.aplica_a}%` });
    }
    if (filters.tipo_validacion) {
      qb.andWhere('tipoDocumento.tipo_validacion LIKE :tipo_validacion', { tipo_validacion: `%${filters.tipo_validacion}%` });
    }
    if (filters.regex_validacion) {
      qb.andWhere('tipoDocumento.regex_validacion LIKE :regex_validacion', { regex_validacion: `%${filters.regex_validacion}%` });
    }
    if (filters.funcion_validacion) {
      qb.andWhere('tipoDocumento.funcion_validacion LIKE :funcion_validacion', { funcion_validacion: `%${filters.funcion_validacion}%` });
    }
    if (filters.formato_ejemplo) {
      qb.andWhere('tipoDocumento.formato_ejemplo LIKE :formato_ejemplo', { formato_ejemplo: `%${filters.formato_ejemplo}%` });
    }
    if (filters.estado) {
      qb.andWhere('tipoDocumento.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('tipoDocumento.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('tipoDocumento.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('tipoDocumento.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('tipoDocumento.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<TipoDocumento>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'tipo', 'aplica_a', 'tipo_validacion', 'regex_validacion', 'funcion_validacion', 'formato_ejemplo', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`tipoDocumento.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('tipoDocumento.agregado_en', 'DESC');
  }
}

import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateArticuloGruposModificadoreDto } from './dto/create-articulo_grupos_modificadore.dto';
import { UpdateArticuloGruposModificadoreDto } from './dto/update-articulo_grupos_modificadore.dto';
import { ArticuloGruposModificadoreFiltersDto } from './dto/pagination.dto';
import { ArticuloGruposModificadore } from './entities/articulo_grupos_modificadore.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class ArticuloGruposModificadoresService {
  constructor(
    @InjectRepository(ArticuloGruposModificadore)
    private articuloGruposModificadoresRepository: Repository<ArticuloGruposModificadore>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateArticuloGruposModificadoreDto) {
    try {
      const record = this.articuloGruposModificadoresRepository.create(dto);
      return await this.articuloGruposModificadoresRepository.save(record);
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
    filters: ArticuloGruposModificadoreFiltersDto,
  ): Promise<ArticuloGruposModificadore[] | PaginationResponse<ArticuloGruposModificadore>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.articuloGruposModificadoresRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.articuloGruposModificadoresRepository.createQueryBuilder('articuloGruposModificadore');
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

  async findOne(articulo_id: number, grupo_modificador_id: number) {
    try {
      const record = await this.articuloGruposModificadoresRepository.findOne({ where: { articulo_id, grupo_modificador_id } });
      if (!record) {
        throw new NotFoundException(`ArticuloGruposModificadore con ID ${articulo_id}/${grupo_modificador_id} no encontrado`);
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

  async update(articulo_id: number, grupo_modificador_id: number, dto: UpdateArticuloGruposModificadoreDto) {
    try {
      const existing = await this.articuloGruposModificadoresRepository.findOne({ where: { articulo_id, grupo_modificador_id } });
      if (!existing) {
        throw new NotFoundException(`ArticuloGruposModificadore con ID ${articulo_id}/${grupo_modificador_id} no encontrado`);
      }
      await this.articuloGruposModificadoresRepository.update({ articulo_id, grupo_modificador_id }, dto);
      return await this.articuloGruposModificadoresRepository.findOne({ where: { articulo_id, grupo_modificador_id } });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al actualizar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(articulo_id: number, grupo_modificador_id: number) {
    try {
      const existing = await this.articuloGruposModificadoresRepository.findOne({ where: { articulo_id, grupo_modificador_id } });
      if (!existing) {
        throw new NotFoundException(`ArticuloGruposModificadore con ID ${articulo_id}/${grupo_modificador_id} no encontrado`);
      }
      await this.articuloGruposModificadoresRepository.delete({ articulo_id, grupo_modificador_id });
      return { message: `ArticuloGruposModificadore con ID ${articulo_id}/${grupo_modificador_id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<ArticuloGruposModificadore>,
    filters: Partial<ArticuloGruposModificadoreFiltersDto>,
  ) {
    
    if (filters.articulo_id !== undefined) {
      qb.andWhere('articuloGruposModificadore.articulo_id = :articulo_id', { articulo_id: filters.articulo_id });
    }
    if (filters.grupo_modificador_id !== undefined) {
      qb.andWhere('articuloGruposModificadore.grupo_modificador_id = :grupo_modificador_id', { grupo_modificador_id: filters.grupo_modificador_id });
    }
  }

  private applySorting(qb: SelectQueryBuilder<ArticuloGruposModificadore>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['articulo_id', 'grupo_modificador_id'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`articuloGruposModificadore.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('articuloGruposModificadore.articulo_id', 'ASC');
  }
}

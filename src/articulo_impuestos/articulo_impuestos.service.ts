import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateArticuloImpuestoDto } from './dto/create-articulo_impuesto.dto';
import { UpdateArticuloImpuestoDto } from './dto/update-articulo_impuesto.dto';
import { ArticuloImpuestoFiltersDto } from './dto/pagination.dto';
import { ArticuloImpuesto } from './entities/articulo_impuesto.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class ArticuloImpuestosService {
  constructor(
    @InjectRepository(ArticuloImpuesto)
    private articuloImpuestosRepository: Repository<ArticuloImpuesto>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateArticuloImpuestoDto) {
    try {
      const record = this.articuloImpuestosRepository.create(dto);
      return await this.articuloImpuestosRepository.save(record);
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
    filters: ArticuloImpuestoFiltersDto,
  ): Promise<ArticuloImpuesto[] | PaginationResponse<ArticuloImpuesto>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.articuloImpuestosRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.articuloImpuestosRepository.createQueryBuilder('articuloImpuesto');
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

  async findOne(articulo_id: number, impuesto_id: number) {
    try {
      const record = await this.articuloImpuestosRepository.findOne({ where: { articulo_id, impuesto_id } });
      if (!record) {
        throw new NotFoundException(`ArticuloImpuesto con ID ${articulo_id}/${impuesto_id} no encontrado`);
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

  async update(articulo_id: number, impuesto_id: number, dto: UpdateArticuloImpuestoDto) {
    try {
      const existing = await this.articuloImpuestosRepository.findOne({ where: { articulo_id, impuesto_id } });
      if (!existing) {
        throw new NotFoundException(`ArticuloImpuesto con ID ${articulo_id}/${impuesto_id} no encontrado`);
      }
      await this.articuloImpuestosRepository.update({ articulo_id, impuesto_id }, dto);
      return await this.articuloImpuestosRepository.findOne({ where: { articulo_id, impuesto_id } });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al actualizar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(articulo_id: number, impuesto_id: number) {
    try {
      const existing = await this.articuloImpuestosRepository.findOne({ where: { articulo_id, impuesto_id } });
      if (!existing) {
        throw new NotFoundException(`ArticuloImpuesto con ID ${articulo_id}/${impuesto_id} no encontrado`);
      }
      await this.articuloImpuestosRepository.delete({ articulo_id, impuesto_id });
      return { message: `ArticuloImpuesto con ID ${articulo_id}/${impuesto_id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<ArticuloImpuesto>,
    filters: Partial<ArticuloImpuestoFiltersDto>,
  ) {
    
    if (filters.articulo_id !== undefined) {
      qb.andWhere('articuloImpuesto.articulo_id = :articulo_id', { articulo_id: filters.articulo_id });
    }
    if (filters.impuesto_id !== undefined) {
      qb.andWhere('articuloImpuesto.impuesto_id = :impuesto_id', { impuesto_id: filters.impuesto_id });
    }
  }

  private applySorting(qb: SelectQueryBuilder<ArticuloImpuesto>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['articulo_id', 'impuesto_id'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`articuloImpuesto.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('articuloImpuesto.articulo_id', 'ASC');
  }
}

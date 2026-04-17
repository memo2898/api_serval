import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockFiltersDto } from './dto/pagination.dto';
import { Stock } from './entities/stock.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateStockDto) {
    try {
      const record = this.stockRepository.create(dto);
      return await this.stockRepository.save(record);
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
    filters: StockFiltersDto,
  ): Promise<Stock[] | PaginationResponse<Stock>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.stockRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.stockRepository.createQueryBuilder('stock');
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

  async findOne(articulo_id: number, sucursal_id: number) {
    try {
      const record = await this.stockRepository.findOne({ where: { articulo_id, sucursal_id } });
      if (!record) {
        throw new NotFoundException(`Stock con ID ${articulo_id}/${sucursal_id} no encontrado`);
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

  async update(articulo_id: number, sucursal_id: number, dto: UpdateStockDto) {
    try {
      const existing = await this.stockRepository.findOne({ where: { articulo_id, sucursal_id } });
      if (!existing) {
        throw new NotFoundException(`Stock con ID ${articulo_id}/${sucursal_id} no encontrado`);
      }
      await this.stockRepository.update({ articulo_id, sucursal_id }, dto);
      return await this.stockRepository.findOne({ where: { articulo_id, sucursal_id } });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al actualizar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(articulo_id: number, sucursal_id: number) {
    try {
      const existing = await this.stockRepository.findOne({ where: { articulo_id, sucursal_id } });
      if (!existing) {
        throw new NotFoundException(`Stock con ID ${articulo_id}/${sucursal_id} no encontrado`);
      }
      await this.stockRepository.delete({ articulo_id, sucursal_id });
      return { message: `Stock con ID ${articulo_id}/${sucursal_id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Stock>,
    filters: Partial<StockFiltersDto>,
  ) {
    
    if (filters.articulo_id !== undefined) {
      qb.andWhere('stock.articulo_id = :articulo_id', { articulo_id: filters.articulo_id });
    }
    if (filters.sucursal_id !== undefined) {
      qb.andWhere('stock.sucursal_id = :sucursal_id', { sucursal_id: filters.sucursal_id });
    }
    if (filters.cantidad_actual !== undefined) {
      qb.andWhere('stock.cantidad_actual = :cantidad_actual', { cantidad_actual: filters.cantidad_actual });
    }
    if (filters.cantidad_minima !== undefined) {
      qb.andWhere('stock.cantidad_minima = :cantidad_minima', { cantidad_minima: filters.cantidad_minima });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Stock>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['articulo_id', 'sucursal_id', 'cantidad_actual', 'cantidad_minima'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`stock.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('stock.articulo_id', 'ASC');
  }
}

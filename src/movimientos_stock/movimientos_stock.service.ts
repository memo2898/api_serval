import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
import { UpdateMovimientosStockDto } from './dto/update-movimientos_stock.dto';
import { MovimientosStockFiltersDto } from './dto/pagination.dto';
import { MovimientosStock } from './entities/movimientos_stock.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class MovimientosStockService {
  constructor(
    @InjectRepository(MovimientosStock)
    private movimientosStockRepository: Repository<MovimientosStock>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateMovimientosStockDto) {
    try {
      const record = this.movimientosStockRepository.create(dto);
      return await this.movimientosStockRepository.save(record);
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
    filters: MovimientosStockFiltersDto,
  ): Promise<MovimientosStock[] | PaginationResponse<MovimientosStock>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.movimientosStockRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.movimientosStockRepository.createQueryBuilder('movimientosStock');
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
      const record = await this.movimientosStockRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`MovimientosStock con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateMovimientosStockDto) {
    try {
      const existing = await this.movimientosStockRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`MovimientosStock con ID ${id} no encontrado`);
      }
      await this.movimientosStockRepository.update(id, dto);
      return await this.movimientosStockRepository.findOne({ where: { id } });
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
      const existing = await this.movimientosStockRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`MovimientosStock con ID ${id} no encontrado`);
      }
      await this.movimientosStockRepository.delete(id);
      return { message: `MovimientosStock con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<MovimientosStock>,
    filters: Partial<MovimientosStockFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('movimientosStock.id = :id', { id: filters.id });
    }
    if (filters.articulo_id !== undefined) {
      qb.andWhere('movimientosStock.articulo_id = :articulo_id', { articulo_id: filters.articulo_id });
    }
    if (filters.sucursal_id !== undefined) {
      qb.andWhere('movimientosStock.sucursal_id = :sucursal_id', { sucursal_id: filters.sucursal_id });
    }
    if (filters.tipo) {
      qb.andWhere('movimientosStock.tipo LIKE :tipo', { tipo: `%${filters.tipo}%` });
    }
    if (filters.cantidad !== undefined) {
      qb.andWhere('movimientosStock.cantidad = :cantidad', { cantidad: filters.cantidad });
    }
    if (filters.referencia) {
      qb.andWhere('movimientosStock.referencia LIKE :referencia', { referencia: `%${filters.referencia}%` });
    }
    if (filters.orden_id !== undefined) {
      qb.andWhere('movimientosStock.orden_id = :orden_id', { orden_id: filters.orden_id });
    }
    if (filters.agregado_en) {
      qb.andWhere('movimientosStock.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('movimientosStock.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<MovimientosStock>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'articulo_id', 'sucursal_id', 'tipo', 'cantidad', 'referencia', 'orden_id', 'agregado_en', 'agregado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`movimientosStock.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('movimientosStock.agregado_en', 'DESC');
  }
}

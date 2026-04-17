import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateComboArticuloDto } from './dto/create-combo_articulo.dto';
import { UpdateComboArticuloDto } from './dto/update-combo_articulo.dto';
import { ComboArticuloFiltersDto } from './dto/pagination.dto';
import { ComboArticulo } from './entities/combo_articulo.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class ComboArticulosService {
  constructor(
    @InjectRepository(ComboArticulo)
    private comboArticulosRepository: Repository<ComboArticulo>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateComboArticuloDto) {
    try {
      const record = this.comboArticulosRepository.create(dto);
      return await this.comboArticulosRepository.save(record);
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
    filters: ComboArticuloFiltersDto,
  ): Promise<ComboArticulo[] | PaginationResponse<ComboArticulo>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.comboArticulosRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.comboArticulosRepository.createQueryBuilder('comboArticulo');
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
      const record = await this.comboArticulosRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`ComboArticulo con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateComboArticuloDto) {
    try {
      const existing = await this.comboArticulosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`ComboArticulo con ID ${id} no encontrado`);
      }
      await this.comboArticulosRepository.update(id, dto);
      return await this.comboArticulosRepository.findOne({ where: { id } });
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
      const existing = await this.comboArticulosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`ComboArticulo con ID ${id} no encontrado`);
      }
      await this.comboArticulosRepository.delete(id);
      return { message: `ComboArticulo con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<ComboArticulo>,
    filters: Partial<ComboArticuloFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('comboArticulo.id = :id', { id: filters.id });
    }
    if (filters.combo_id !== undefined) {
      qb.andWhere('comboArticulo.combo_id = :combo_id', { combo_id: filters.combo_id });
    }
    if (filters.articulo_id !== undefined) {
      qb.andWhere('comboArticulo.articulo_id = :articulo_id', { articulo_id: filters.articulo_id });
    }
    if (filters.cantidad !== undefined) {
      qb.andWhere('comboArticulo.cantidad = :cantidad', { cantidad: filters.cantidad });
    }
    if (filters.precio_especial !== undefined) {
      qb.andWhere('comboArticulo.precio_especial = :precio_especial', { precio_especial: filters.precio_especial });
    }
  }

  private applySorting(qb: SelectQueryBuilder<ComboArticulo>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'combo_id', 'articulo_id', 'cantidad', 'precio_especial'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`comboArticulo.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('comboArticulo.id', 'DESC');
  }
}

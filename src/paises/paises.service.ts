import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreatePaiseDto } from './dto/create-paise.dto';
import { UpdatePaiseDto } from './dto/update-paise.dto';
import { PaiseFiltersDto } from './dto/pagination.dto';
import { Paise } from './entities/paise.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class PaisesService {
  constructor(
    @InjectRepository(Paise)
    private paisesRepository: Repository<Paise>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreatePaiseDto) {
    try {
      const record = this.paisesRepository.create(dto);
      return await this.paisesRepository.save(record);
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
    filters: PaiseFiltersDto,
  ): Promise<Paise[] | PaginationResponse<Paise>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.paisesRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.paisesRepository.createQueryBuilder('paise');
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
      const record = await this.paisesRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Paise con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdatePaiseDto) {
    try {
      const existing = await this.paisesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Paise con ID ${id} no encontrado`);
      }
      await this.paisesRepository.update(id, dto);
      return await this.paisesRepository.findOne({ where: { id } });
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
      const existing = await this.paisesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Paise con ID ${id} no encontrado`);
      }
      await this.paisesRepository.delete(id);
      return { message: `Paise con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Paise>,
    filters: Partial<PaiseFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('paise.id = :id', { id: filters.id });
    }
    if (filters.nombre) {
      qb.andWhere('paise.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.moneda_defecto) {
      qb.andWhere('paise.moneda_defecto LIKE :moneda_defecto', { moneda_defecto: `%${filters.moneda_defecto}%` });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Paise>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'nombre', 'codigo_iso', 'moneda_defecto'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`paise.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('paise.id', 'DESC');
  }
}

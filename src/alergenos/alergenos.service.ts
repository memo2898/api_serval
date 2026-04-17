import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateAlergenoDto } from './dto/create-alergeno.dto';
import { UpdateAlergenoDto } from './dto/update-alergeno.dto';
import { AlergenoFiltersDto } from './dto/pagination.dto';
import { Alergeno } from './entities/alergeno.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class AlergenosService {
  constructor(
    @InjectRepository(Alergeno)
    private alergenosRepository: Repository<Alergeno>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateAlergenoDto) {
    try {
      const record = this.alergenosRepository.create(dto);
      return await this.alergenosRepository.save(record);
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
    filters: AlergenoFiltersDto,
  ): Promise<Alergeno[] | PaginationResponse<Alergeno>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.alergenosRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.alergenosRepository.createQueryBuilder('alergeno');
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
      const record = await this.alergenosRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Alergeno con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateAlergenoDto) {
    try {
      const existing = await this.alergenosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Alergeno con ID ${id} no encontrado`);
      }
      await this.alergenosRepository.update(id, dto);
      return await this.alergenosRepository.findOne({ where: { id } });
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
      const existing = await this.alergenosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Alergeno con ID ${id} no encontrado`);
      }
      await this.alergenosRepository.delete(id);
      return { message: `Alergeno con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Alergeno>,
    filters: Partial<AlergenoFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('alergeno.id = :id', { id: filters.id });
    }
    if (filters.nombre) {
      qb.andWhere('alergeno.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.icono) {
      qb.andWhere('alergeno.icono LIKE :icono', { icono: `%${filters.icono}%` });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Alergeno>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'nombre', 'icono'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`alergeno.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('alergeno.id', 'DESC');
  }
}

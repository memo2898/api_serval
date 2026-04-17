import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateOrdenLineaModificadoreDto } from './dto/create-orden_linea_modificadore.dto';
import { UpdateOrdenLineaModificadoreDto } from './dto/update-orden_linea_modificadore.dto';
import { OrdenLineaModificadoreFiltersDto } from './dto/pagination.dto';
import { OrdenLineaModificadore } from './entities/orden_linea_modificadore.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class OrdenLineaModificadoresService {
  constructor(
    @InjectRepository(OrdenLineaModificadore)
    private ordenLineaModificadoresRepository: Repository<OrdenLineaModificadore>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateOrdenLineaModificadoreDto) {
    try {
      const record = this.ordenLineaModificadoresRepository.create(dto);
      return await this.ordenLineaModificadoresRepository.save(record);
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
    filters: OrdenLineaModificadoreFiltersDto,
  ): Promise<OrdenLineaModificadore[] | PaginationResponse<OrdenLineaModificadore>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.ordenLineaModificadoresRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.ordenLineaModificadoresRepository.createQueryBuilder('ordenLineaModificadore');
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
      const record = await this.ordenLineaModificadoresRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`OrdenLineaModificadore con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateOrdenLineaModificadoreDto) {
    try {
      const existing = await this.ordenLineaModificadoresRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`OrdenLineaModificadore con ID ${id} no encontrado`);
      }
      await this.ordenLineaModificadoresRepository.update(id, dto);
      return await this.ordenLineaModificadoresRepository.findOne({ where: { id } });
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
      const existing = await this.ordenLineaModificadoresRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`OrdenLineaModificadore con ID ${id} no encontrado`);
      }
      await this.ordenLineaModificadoresRepository.delete(id);
      return { message: `OrdenLineaModificadore con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<OrdenLineaModificadore>,
    filters: Partial<OrdenLineaModificadoreFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('ordenLineaModificadore.id = :id', { id: filters.id });
    }
    if (filters.orden_linea_id !== undefined) {
      qb.andWhere('ordenLineaModificadore.orden_linea_id = :orden_linea_id', { orden_linea_id: filters.orden_linea_id });
    }
    if (filters.modificador_id !== undefined) {
      qb.andWhere('ordenLineaModificadore.modificador_id = :modificador_id', { modificador_id: filters.modificador_id });
    }
    if (filters.precio_extra !== undefined) {
      qb.andWhere('ordenLineaModificadore.precio_extra = :precio_extra', { precio_extra: filters.precio_extra });
    }
  }

  private applySorting(qb: SelectQueryBuilder<OrdenLineaModificadore>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'orden_linea_id', 'modificador_id', 'precio_extra'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`ordenLineaModificadore.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('ordenLineaModificadore.id', 'DESC');
  }
}

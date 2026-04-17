import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { FacturaFiltersDto } from './dto/pagination.dto';
import { Factura } from './entities/factura.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private facturasRepository: Repository<Factura>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateFacturaDto) {
    try {
      const record = this.facturasRepository.create(dto);
      return await this.facturasRepository.save(record);
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
    filters: FacturaFiltersDto,
  ): Promise<Factura[] | PaginationResponse<Factura>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.facturasRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.facturasRepository.createQueryBuilder('factura');
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
      const record = await this.facturasRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Factura con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateFacturaDto) {
    try {
      const existing = await this.facturasRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Factura con ID ${id} no encontrado`);
      }
      await this.facturasRepository.update(id, dto);
      return await this.facturasRepository.findOne({ where: { id } });
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
      const existing = await this.facturasRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Factura con ID ${id} no encontrado`);
      }
      await this.facturasRepository.delete(id);
      return { message: `Factura con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Factura>,
    filters: Partial<FacturaFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('factura.id = :id', { id: filters.id });
    }
    if (filters.orden_id !== undefined) {
      qb.andWhere('factura.orden_id = :orden_id', { orden_id: filters.orden_id });
    }
    if (filters.cliente_id !== undefined) {
      qb.andWhere('factura.cliente_id = :cliente_id', { cliente_id: filters.cliente_id });
    }
    if (filters.numero_factura) {
      qb.andWhere('factura.numero_factura LIKE :numero_factura', { numero_factura: `%${filters.numero_factura}%` });
    }
    if (filters.tipo) {
      qb.andWhere('factura.tipo LIKE :tipo', { tipo: `%${filters.tipo}%` });
    }
    if (filters.subtotal !== undefined) {
      qb.andWhere('factura.subtotal = :subtotal', { subtotal: filters.subtotal });
    }
    if (filters.impuestos !== undefined) {
      qb.andWhere('factura.impuestos = :impuestos', { impuestos: filters.impuestos });
    }
    if (filters.total !== undefined) {
      qb.andWhere('factura.total = :total', { total: filters.total });
    }
    if (filters.anulada !== undefined) {
      qb.andWhere('factura.anulada = :anulada', { anulada: filters.anulada });
    }
    if (filters.agregado_en) {
      qb.andWhere('factura.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('factura.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('factura.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('factura.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Factura>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'orden_id', 'cliente_id', 'numero_factura', 'tipo', 'subtotal', 'impuestos', 'total', 'anulada', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`factura.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('factura.agregado_en', 'DESC');
  }
}

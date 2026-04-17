import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateSucursalImpuestoDto } from './dto/create-sucursal_impuesto.dto';
import { UpdateSucursalImpuestoDto } from './dto/update-sucursal_impuesto.dto';
import { SucursalImpuestoFiltersDto } from './dto/pagination.dto';
import { SucursalImpuesto } from './entities/sucursal_impuesto.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class SucursalImpuestosService {
  constructor(
    @InjectRepository(SucursalImpuesto)
    private sucursalImpuestosRepository: Repository<SucursalImpuesto>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateSucursalImpuestoDto) {
    try {
      const record = this.sucursalImpuestosRepository.create(dto);
      return await this.sucursalImpuestosRepository.save(record);
    } catch (error: unknown) {
      throw new HttpException(
        `Error al crear el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(
    filters: SucursalImpuestoFiltersDto,
  ): Promise<SucursalImpuesto[] | PaginationResponse<SucursalImpuesto>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.sucursalImpuestosRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.sucursalImpuestosRepository.createQueryBuilder('si');
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

  async findOne(sucursalId: number, impuestoId: number) {
    try {
      const record = await this.sucursalImpuestosRepository.findOne({
        where: { sucursal_id: sucursalId, impuesto_id: impuestoId },
      });
      if (!record) {
        throw new NotFoundException(
          `SucursalImpuesto [sucursal=${sucursalId}, impuesto=${impuestoId}] no encontrado`,
        );
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

  async update(sucursalId: number, impuestoId: number, dto: UpdateSucursalImpuestoDto) {
    try {
      const existing = await this.sucursalImpuestosRepository.findOne({
        where: { sucursal_id: sucursalId, impuesto_id: impuestoId },
      });
      if (!existing) {
        throw new NotFoundException(
          `SucursalImpuesto [sucursal=${sucursalId}, impuesto=${impuestoId}] no encontrado`,
        );
      }
      await this.sucursalImpuestosRepository.update(
        { sucursal_id: sucursalId, impuesto_id: impuestoId },
        dto,
      );
      return await this.sucursalImpuestosRepository.findOne({
        where: { sucursal_id: sucursalId, impuesto_id: impuestoId },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al actualizar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(sucursalId: number, impuestoId: number) {
    try {
      const existing = await this.sucursalImpuestosRepository.findOne({
        where: { sucursal_id: sucursalId, impuesto_id: impuestoId },
      });
      if (!existing) {
        throw new NotFoundException(
          `SucursalImpuesto [sucursal=${sucursalId}, impuesto=${impuestoId}] no encontrado`,
        );
      }
      await this.sucursalImpuestosRepository.delete({
        sucursal_id: sucursalId,
        impuesto_id: impuestoId,
      });
      return { message: `SucursalImpuesto [sucursal=${sucursalId}, impuesto=${impuestoId}] eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<SucursalImpuesto>,
    filters: Partial<SucursalImpuestoFiltersDto>,
  ) {
    if (filters.sucursal_id !== undefined) {
      qb.andWhere('si.sucursal_id = :sucursal_id', { sucursal_id: filters.sucursal_id });
    }
    if (filters.impuesto_id !== undefined) {
      qb.andWhere('si.impuesto_id = :impuesto_id', { impuesto_id: filters.impuesto_id });
    }
    if (filters.obligatorio !== undefined) {
      qb.andWhere('si.obligatorio = :obligatorio', { obligatorio: filters.obligatorio });
    }
    if (filters.orden_aplicacion !== undefined) {
      qb.andWhere('si.orden_aplicacion = :orden_aplicacion', { orden_aplicacion: filters.orden_aplicacion });
    }
  }

  private applySorting(qb: SelectQueryBuilder<SucursalImpuesto>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['sucursal_id', 'impuesto_id', 'obligatorio', 'orden_aplicacion'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`si.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('si.orden_aplicacion', 'ASC');
  }
}

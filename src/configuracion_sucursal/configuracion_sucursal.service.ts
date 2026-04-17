import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateConfiguracionSucursalDto } from './dto/create-configuracion_sucursal.dto';
import { UpdateConfiguracionSucursalDto } from './dto/update-configuracion_sucursal.dto';
import { ConfiguracionSucursalFiltersDto } from './dto/pagination.dto';
import { ConfiguracionSucursal } from './entities/configuracion_sucursal.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class ConfiguracionSucursalService {
  constructor(
    @InjectRepository(ConfiguracionSucursal)
    private configuracionSucursalRepository: Repository<ConfiguracionSucursal>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateConfiguracionSucursalDto) {
    try {
      const record = this.configuracionSucursalRepository.create(dto);
      return await this.configuracionSucursalRepository.save(record);
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
    filters: ConfiguracionSucursalFiltersDto,
  ): Promise<ConfiguracionSucursal[] | PaginationResponse<ConfiguracionSucursal>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.configuracionSucursalRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.configuracionSucursalRepository.createQueryBuilder('configuracionSucursal');
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

  async findOne(sucursal_id: number) {
    try {
      const record = await this.configuracionSucursalRepository.findOne({ where: { sucursal_id } });
      if (!record) {
        throw new NotFoundException(`ConfiguracionSucursal con ID ${sucursal_id} no encontrado`);
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

  async update(sucursal_id: number, dto: UpdateConfiguracionSucursalDto) {
    try {
      const existing = await this.configuracionSucursalRepository.findOne({ where: { sucursal_id } });
      if (!existing) {
        throw new NotFoundException(`ConfiguracionSucursal con ID ${sucursal_id} no encontrado`);
      }
      await this.configuracionSucursalRepository.update({ sucursal_id }, dto);
      return await this.configuracionSucursalRepository.findOne({ where: { sucursal_id } });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al actualizar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(sucursal_id: number) {
    try {
      const existing = await this.configuracionSucursalRepository.findOne({ where: { sucursal_id } });
      if (!existing) {
        throw new NotFoundException(`ConfiguracionSucursal con ID ${sucursal_id} no encontrado`);
      }
      await this.configuracionSucursalRepository.delete({ sucursal_id });
      return { message: `ConfiguracionSucursal con ID ${sucursal_id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<ConfiguracionSucursal>,
    filters: Partial<ConfiguracionSucursalFiltersDto>,
  ) {
    
    if (filters.sucursal_id !== undefined) {
      qb.andWhere('configuracionSucursal.sucursal_id = :sucursal_id', { sucursal_id: filters.sucursal_id });
    }
    if (filters.tiene_mesas !== undefined) {
      qb.andWhere('configuracionSucursal.tiene_mesas = :tiene_mesas', { tiene_mesas: filters.tiene_mesas });
    }
    if (filters.tiene_delivery !== undefined) {
      qb.andWhere('configuracionSucursal.tiene_delivery = :tiene_delivery', { tiene_delivery: filters.tiene_delivery });
    }
    if (filters.tiene_barra !== undefined) {
      qb.andWhere('configuracionSucursal.tiene_barra = :tiene_barra', { tiene_barra: filters.tiene_barra });
    }
    if (filters.impuesto_defecto_id !== undefined) {
      qb.andWhere('configuracionSucursal.impuesto_defecto_id = :impuesto_defecto_id', { impuesto_defecto_id: filters.impuesto_defecto_id });
    }
    if (filters.tarifa_defecto_id !== undefined) {
      qb.andWhere('configuracionSucursal.tarifa_defecto_id = :tarifa_defecto_id', { tarifa_defecto_id: filters.tarifa_defecto_id });
    }
    if (filters.moneda) {
      qb.andWhere('configuracionSucursal.moneda LIKE :moneda', { moneda: `%${filters.moneda}%` });
    }
    if (filters.formato_fecha) {
      qb.andWhere('configuracionSucursal.formato_fecha LIKE :formato_fecha', { formato_fecha: `%${filters.formato_fecha}%` });
    }
    if (filters.zona_horaria) {
      qb.andWhere('configuracionSucursal.zona_horaria LIKE :zona_horaria', { zona_horaria: `%${filters.zona_horaria}%` });
    }
    if (filters.permite_venta_sin_stock !== undefined) {
      qb.andWhere('configuracionSucursal.permite_venta_sin_stock = :permite_venta_sin_stock', { permite_venta_sin_stock: filters.permite_venta_sin_stock });
    }
    if (filters.requiere_mesa_para_orden !== undefined) {
      qb.andWhere('configuracionSucursal.requiere_mesa_para_orden = :requiere_mesa_para_orden', { requiere_mesa_para_orden: filters.requiere_mesa_para_orden });
    }
    if (filters.imprime_automatico_al_cerrar !== undefined) {
      qb.andWhere('configuracionSucursal.imprime_automatico_al_cerrar = :imprime_automatico_al_cerrar', { imprime_automatico_al_cerrar: filters.imprime_automatico_al_cerrar });
    }
    if (filters.actualizado_en) {
      qb.andWhere('configuracionSucursal.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('configuracionSucursal.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<ConfiguracionSucursal>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['sucursal_id', 'tiene_mesas', 'tiene_delivery', 'tiene_barra', 'impuesto_defecto_id', 'tarifa_defecto_id', 'moneda', 'formato_fecha', 'zona_horaria', 'permite_venta_sin_stock', 'requiere_mesa_para_orden', 'imprime_automatico_al_cerrar', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`configuracionSucursal.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('configuracionSucursal.sucursal_id', 'ASC');
  }
}

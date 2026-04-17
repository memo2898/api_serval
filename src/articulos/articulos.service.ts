import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { ArticuloFiltersDto } from './dto/pagination.dto';
import { Articulo } from './entities/articulo.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private articulosRepository: Repository<Articulo>,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateArticuloDto) {
    try {
      const record = this.articulosRepository.create(dto);
      return await this.articulosRepository.save(record);
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
    filters: ArticuloFiltersDto,
  ): Promise<Articulo[] | PaginationResponse<Articulo>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.articulosRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.articulosRepository.createQueryBuilder('articulo');
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
      const record = await this.articulosRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Articulo con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateArticuloDto) {
    try {
      const existing = await this.articulosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Articulo con ID ${id} no encontrado`);
      }
      await this.articulosRepository.update(id, dto);
      return await this.articulosRepository.findOne({ where: { id } });
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
      const existing = await this.articulosRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Articulo con ID ${id} no encontrado`);
      }
      await this.articulosRepository.delete(id);
      return { message: `Articulo con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Articulo>,
    filters: Partial<ArticuloFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('articulo.id = :id', { id: filters.id });
    }
    if (filters.familia_id !== undefined) {
      qb.andWhere('articulo.familia_id = :familia_id', { familia_id: filters.familia_id });
    }
    if (filters.subfamilia_id !== undefined) {
      qb.andWhere('articulo.subfamilia_id = :subfamilia_id', { subfamilia_id: filters.subfamilia_id });
    }
    if (filters.nombre) {
      qb.andWhere('articulo.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
    }
    if (filters.descripcion) {
      qb.andWhere('articulo.descripcion LIKE :descripcion', { descripcion: `%${filters.descripcion}%` });
    }
    if (filters.referencia) {
      qb.andWhere('articulo.referencia LIKE :referencia', { referencia: `%${filters.referencia}%` });
    }
    if (filters.codigo_barras) {
      qb.andWhere('articulo.codigo_barras LIKE :codigo_barras', { codigo_barras: `%${filters.codigo_barras}%` });
    }
    if (filters.precio_venta !== undefined) {
      qb.andWhere('articulo.precio_venta = :precio_venta', { precio_venta: filters.precio_venta });
    }
    if (filters.coste !== undefined) {
      qb.andWhere('articulo.coste = :coste', { coste: filters.coste });
    }
    if (filters.tiene_stock !== undefined) {
      qb.andWhere('articulo.tiene_stock = :tiene_stock', { tiene_stock: filters.tiene_stock });
    }
    if (filters.vendido_por_peso !== undefined) {
      qb.andWhere('articulo.vendido_por_peso = :vendido_por_peso', { vendido_por_peso: filters.vendido_por_peso });
    }
    if (filters.impuesto_id !== undefined) {
      qb.andWhere('articulo.impuesto_id = :impuesto_id', { impuesto_id: filters.impuesto_id });
    }
    if (filters.tiempo_preparacion !== undefined) {
      qb.andWhere('articulo.tiempo_preparacion = :tiempo_preparacion', { tiempo_preparacion: filters.tiempo_preparacion });
    }
    if (filters.imagen) {
      qb.andWhere('articulo.imagen LIKE :imagen', { imagen: `%${filters.imagen}%` });
    }
    if (filters.estado) {
      qb.andWhere('articulo.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.agregado_en) {
      qb.andWhere('articulo.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('articulo.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('articulo.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('articulo.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Articulo>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'familia_id', 'subfamilia_id', 'nombre', 'descripcion', 'referencia', 'codigo_barras', 'precio_venta', 'coste', 'tiene_stock', 'vendido_por_peso', 'impuesto_id', 'tiempo_preparacion', 'imagen', 'estado', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`articulo.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('articulo.agregado_en', 'DESC');
  }
}

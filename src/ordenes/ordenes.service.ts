import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { OrdeneFiltersDto } from './dto/pagination.dto';
import { Ordene } from './entities/ordene.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';
import { OrdenPagosService } from '../orden_pagos/orden_pagos.service';
import { CajaHandler } from '../sockets/handlers/caja.handler';
import { FacturasService } from '../facturas/facturas.service';

export interface PagoInput {
  forma_pago_id: number;
  monto: number;
  cuenta_num?: number;
  referencia?: string;
}

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Ordene)
    private ordenesRepository: Repository<Ordene>,
    private readonly ordenPagosService: OrdenPagosService,
    private readonly cajaHandler: CajaHandler,
    private readonly facturasService: FacturasService,
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
  }

  async create(dto: CreateOrdeneDto) {
    try {
      return await this.ordenesRepository.manager.transaction(async (em) => {
        // Lock a nivel de sucursal para evitar numero_orden duplicado en concurrencia
        await em.query('SELECT pg_advisory_xact_lock($1)', [dto.sucursal_id]);

        const [{ next }] = await em.query<[{ next: string }]>(
          `SELECT COALESCE(MAX(numero_orden), 0) + 1 AS next
             FROM ordenes
            WHERE sucursal_id = $1`,
          [dto.sucursal_id],
        );

        const record = em.create(Ordene, { ...dto, numero_orden: Number(next) });
        return await em.save(record);
      });
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
    filters: OrdeneFiltersDto,
  ): Promise<Ordene[] | PaginationResponse<Ordene>> {
    try {
      const hasParams = Object.values(filters).some(
        (v) => v !== undefined && v !== null && v !== '',
      );

      if (!hasParams) {
        return await this.ordenesRepository.find();
      }

      const { page, limit, sort, ...filterParams } = filters;

      const qb = this.ordenesRepository.createQueryBuilder('ordene');
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
      const record = await this.ordenesRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Ordene con ID ${id} no encontrado`);
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

  async update(id: number, dto: UpdateOrdeneDto) {
    try {
      const existing = await this.ordenesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Ordene con ID ${id} no encontrado`);
      }

      // Una orden por_cobrar no puede ser degradada a un estado anterior.
      // Si el mesero agrega más artículos y los envía a cocina, eso no debe
      // sobreescribir el estado de cobro — la orden sigue esperando pago.
      const estadosFinalCobro = ['por_cobrar', 'cobrada'];
      if (
        dto.estado &&
        estadosFinalCobro.includes(existing.estado) &&
        !estadosFinalCobro.includes(dto.estado)
      ) {
        delete (dto as any).estado;
      }

      await this.ordenesRepository.update(id, dto);
      const updated = await this.ordenesRepository.findOne({ where: { id } });

      if (dto.estado === 'por_cobrar') {
        this.cajaHandler.emitOrdenListaCobrar(existing.sucursal_id, {
          orden_id:        id,
          mesa:            (existing as any).mesa?.nombre ?? `Mesa ${existing.mesa_id}`,
          mesa_id:         existing.mesa_id,
          total:           Number(existing.total ?? 0),
          subtotal:        Number(existing.subtotal ?? 0),
          impuestos:       Number(existing.impuestos_total ?? 0),
          descuento_total: Number(existing.descuento_total ?? 0),
          numero_orden:    existing.numero_orden,
          tipo_servicio:   existing.tipo_servicio,
          timestamp:       new Date().toISOString(),
        });
      }

      return updated;
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
      const existing = await this.ordenesRepository.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Ordene con ID ${id} no encontrado`);
      }
      await this.ordenesRepository.delete(id);
      return { message: `Ordene con ID ${id} eliminado correctamente` };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Ordene>,
    filters: Partial<OrdeneFiltersDto>,
  ) {
    
    if (filters.id !== undefined) {
      qb.andWhere('ordene.id = :id', { id: filters.id });
    }
    if (filters.sucursal_id !== undefined) {
      qb.andWhere('ordene.sucursal_id = :sucursal_id', { sucursal_id: filters.sucursal_id });
    }
    if (filters.terminal_id !== undefined) {
      qb.andWhere('ordene.terminal_id = :terminal_id', { terminal_id: filters.terminal_id });
    }
    if (filters.usuario_id !== undefined) {
      qb.andWhere('ordene.usuario_id = :usuario_id', { usuario_id: filters.usuario_id });
    }
    if (filters.mesa_id !== undefined) {
      qb.andWhere('ordene.mesa_id = :mesa_id', { mesa_id: filters.mesa_id });
    }
    if (filters.cliente_id !== undefined) {
      qb.andWhere('ordene.cliente_id = :cliente_id', { cliente_id: filters.cliente_id });
    }
    if (filters.turno_id !== undefined) {
      qb.andWhere('ordene.turno_id = :turno_id', { turno_id: filters.turno_id });
    }
    if (filters.tipo_servicio) {
      qb.andWhere('ordene.tipo_servicio LIKE :tipo_servicio', { tipo_servicio: `%${filters.tipo_servicio}%` });
    }
    if (filters.estado) {
      qb.andWhere('ordene.estado LIKE :estado', { estado: `%${filters.estado}%` });
    }
    if (filters.numero_orden !== undefined) {
      qb.andWhere('ordene.numero_orden = :numero_orden', { numero_orden: filters.numero_orden });
    }
    if (filters.descuento_total !== undefined) {
      qb.andWhere('ordene.descuento_total = :descuento_total', { descuento_total: filters.descuento_total });
    }
    if (filters.subtotal !== undefined) {
      qb.andWhere('ordene.subtotal = :subtotal', { subtotal: filters.subtotal });
    }
    if (filters.impuestos_total !== undefined) {
      qb.andWhere('ordene.impuestos_total = :impuestos_total', { impuestos_total: filters.impuestos_total });
    }
    if (filters.total !== undefined) {
      qb.andWhere('ordene.total = :total', { total: filters.total });
    }
    if (filters.notas) {
      qb.andWhere('ordene.notas LIKE :notas', { notas: `%${filters.notas}%` });
    }
    if (filters.fecha_apertura) {
      qb.andWhere('ordene.fecha_apertura = :fecha_apertura', { fecha_apertura: filters.fecha_apertura });
    }
    if (filters.fecha_cierre) {
      qb.andWhere('ordene.fecha_cierre = :fecha_cierre', { fecha_cierre: filters.fecha_cierre });
    }
    if (filters.agregado_en) {
      qb.andWhere('ordene.agregado_en = :agregado_en', { agregado_en: filters.agregado_en });
    }
    if (filters.agregado_por !== undefined) {
      qb.andWhere('ordene.agregado_por = :agregado_por', { agregado_por: filters.agregado_por });
    }
    if (filters.actualizado_en) {
      qb.andWhere('ordene.actualizado_en = :actualizado_en', { actualizado_en: filters.actualizado_en });
    }
    if (filters.actualizado_por !== undefined) {
      qb.andWhere('ordene.actualizado_por = :actualizado_por', { actualizado_por: filters.actualizado_por });
    }
  }

  // ─── Cobrar orden ──────────────────────────────────────────────────────────

  async cobrar(id: number, pagos: PagoInput[]) {
    const orden = await this.ordenesRepository.findOne({ where: { id } });
    if (!orden) throw new NotFoundException(`Orden ${id} no encontrada`);

    if (!pagos?.length) {
      throw new HttpException('Se requiere al menos un pago', HttpStatus.BAD_REQUEST);
    }

    const ahora = new Date();

    // 1. Guardar cada pago en orden_pagos
    await Promise.all(
      pagos.map(p =>
        this.ordenPagosService.create({
          orden_id:      id,
          forma_pago_id: p.forma_pago_id,
          monto:         p.monto,
          referencia:    p.referencia,
          agregado_en:   ahora.toISOString(),
        }),
      ),
    );

    // 2. Cerrar la orden
    await this.ordenesRepository.update(id, {
      estado:      'cobrada',
      fecha_cierre: ahora,
    });

    // 3. Crear registro en facturas
    const montoTotal    = pagos.reduce((s, p) => s + Number(p.monto), 0);
    const subtotal      = Number(orden.subtotal ?? 0);
    const impuestosVal  = Math.round((montoTotal - subtotal) * 100) / 100;
    const numeroFactura = `F-${orden.sucursal_id}-${orden.numero_orden ?? id}-${ahora.getTime()}`;

    await this.facturasService.create({
      orden_id:        id,
      numero_factura:  numeroFactura,
      tipo:            'consumo',
      subtotal,
      impuestos:       impuestosVal > 0 ? impuestosVal : undefined,
      total:           montoTotal,
      anulada:         false,
      agregado_en:     ahora.toISOString(),
    });

    // 4. Notificar vía socket a mesas y caja
    this.cajaHandler.emitPagoRegistrado(orden.sucursal_id, {
      orden_id:       id,
      mesa_id:        orden.mesa_id,
      monto_total:    pagos.reduce((s, p) => s + Number(p.monto), 0),
      estado_orden:   'cobrada',
    });

    return { mensaje: 'Cobro registrado', orden_id: id, pagos_guardados: pagos.length };
  }

  private applySorting(qb: SelectQueryBuilder<Ordene>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['id', 'sucursal_id', 'terminal_id', 'usuario_id', 'mesa_id', 'cliente_id', 'turno_id', 'tipo_servicio', 'estado', 'numero_orden', 'descuento_total', 'subtotal', 'impuestos_total', 'total', 'notas', 'fecha_apertura', 'fecha_cierre', 'agregado_en', 'agregado_por', 'actualizado_en', 'actualizado_por'];
      if (validFields.includes(field) && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        qb.orderBy(`ordene.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        return;
      }
    }
    qb.orderBy('ordene.agregado_en', 'DESC');
  }
}

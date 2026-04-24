import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ReporteVentasDto } from './dto/reporte-ventas.dto';

@Injectable()
export class ReportesService {
  constructor(private readonly dataSource: DataSource) {}

  async ventasPorRango(filtros: ReporteVentasDto) {
    try {
      const { fecha_inicio, fecha_fin, sucursal_id, area } = filtros;
      return area
        ? this._ventasPorArea(fecha_inicio, fecha_fin, area, sucursal_id)
        : this._ventasConsolidadas(fecha_inicio, fecha_fin, sucursal_id);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        `Error al generar el reporte de ventas: ${msg}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async _ventasConsolidadas(
    fecha_inicio: string,
    fecha_fin: string,
    sucursal_id?: number,
  ) {
    const fechaFinDia = `${fecha_fin} 23:59:59`;
    const sucursalCondicion = sucursal_id ? `AND o.sucursal_id = ${sucursal_id}` : '';
    const sucursalImpuestoCondicion = sucursal_id ? `WHERE si.sucursal_id = ${sucursal_id}` : '';

    const [resumen] = await this.dataSource.query<
      { total_ordenes: string; total_ventas: string }[]
    >(
      `
      SELECT
        COUNT(DISTINCT o.id)       AS total_ordenes,
        COALESCE(SUM(op.monto), 0) AS total_ventas
      FROM public.ordenes o
      LEFT JOIN public.orden_pagos op ON op.orden_id = o.id
      WHERE o.estado = 'cobrada'
        AND o.fecha_cierre BETWEEN $1 AND $2
        ${sucursalCondicion}
      `,
      [fecha_inicio, fechaFinDia],
    );

    const tasasQuery = await this.dataSource.query<
      { impuesto_id: number; nombre: string; porcentaje: string; orden_aplicacion: number }[]
    >(
      `
      SELECT DISTINCT ON (si.impuesto_id)
        si.impuesto_id,
        i.nombre,
        i.porcentaje,
        si.orden_aplicacion
      FROM public.sucursal_impuestos si
      INNER JOIN public.impuestos i ON i.id = si.impuesto_id
      ${sucursalImpuestoCondicion}
      ORDER BY si.impuesto_id, si.orden_aplicacion
      `,
    );

    const totalVentas = Number(resumen.total_ventas);
    const tasaTotal = tasasQuery.reduce((sum, t) => sum + Number(t.porcentaje) / 100, 0);
    const subtotal = tasaTotal > 0 ? totalVentas / (1 + tasaTotal) : totalVentas;
    const totalImpuestos = totalVentas - subtotal;

    const impuestosDetalle = tasasQuery.map((t) => {
      const tasa = Number(t.porcentaje) / 100;
      return {
        impuesto_id: t.impuesto_id,
        nombre: t.nombre,
        porcentaje: Number(t.porcentaje),
        monto: round(subtotal * tasa),
      };
    });

    const porFormaPago = await this.dataSource.query<
      { forma_pago_id: number; forma_pago: string; total: string; cantidad_transacciones: string }[]
    >(
      `
      SELECT
        fp.id                      AS forma_pago_id,
        fp.nombre                  AS forma_pago,
        COALESCE(SUM(op.monto), 0) AS total,
        COUNT(op.id)               AS cantidad_transacciones
      FROM public.orden_pagos op
      INNER JOIN public.ordenes    o  ON o.id  = op.orden_id
      INNER JOIN public.formas_pago fp ON fp.id = op.forma_pago_id
      WHERE o.estado = 'cobrada'
        AND o.fecha_cierre BETWEEN $1 AND $2
        ${sucursalCondicion}
      GROUP BY fp.id, fp.nombre
      ORDER BY total DESC
      `,
      [fecha_inicio, fechaFinDia],
    );

    return {
      periodo: { fecha_inicio, fecha_fin },
      area: 'total',
      ...(sucursal_id ? { sucursal_id } : {}),
      resumen: {
        total_ordenes: Number(resumen.total_ordenes),
        subtotal: round(subtotal),
        impuestos: round(totalImpuestos),
        total_ventas: round(totalVentas),
      },
      impuestos_detalle: impuestosDetalle,
      por_forma_pago: porFormaPago.map((r) => ({
        forma_pago_id: r.forma_pago_id,
        forma_pago: r.forma_pago,
        total: round(Number(r.total)),
        cantidad_transacciones: Number(r.cantidad_transacciones),
      })),
    };
  }

  private async _ventasPorArea(
    fecha_inicio: string,
    fecha_fin: string,
    area: 'cocina' | 'barra',
    sucursal_id?: number,
  ) {
    const fechaFinDia = `${fecha_fin} 23:59:59`;
    const sucursalCondicion = sucursal_id ? `AND o.sucursal_id = ${sucursal_id}` : '';
    const sucursalImpuestoCondicion = sucursal_id ? `WHERE si.sucursal_id = ${sucursal_id}` : '';

    // Líneas filtradas por destino_impresion de la familia del artículo
    const lineasQuery = await this.dataSource.query<
      { total_ordenes: string; subtotal_area: string; impuesto_area: string }[]
    >(
      `
      SELECT
        COUNT(DISTINCT o.id)              AS total_ordenes,
        COALESCE(SUM(ol.subtotal_linea),0) AS subtotal_area,
        COALESCE(SUM(ol.impuesto_linea),0) AS impuesto_area
      FROM public.ordenes o
      INNER JOIN public.orden_lineas ol ON ol.orden_id = o.id
      INNER JOIN public.articulos    a  ON a.id = ol.articulo_id
      INNER JOIN public.familias     f  ON f.id = a.familia_id
      WHERE o.estado = 'cobrada'
        AND o.fecha_cierre BETWEEN $1 AND $2
        AND f.destino_impresion = $3
        ${sucursalCondicion}
      `,
      [fecha_inicio, fechaFinDia, area],
    );

    const [row] = lineasQuery;
    const subtotal     = Number(row?.subtotal_area ?? 0);
    const impuestoArea = Number(row?.impuesto_area ?? 0);
    const totalVentas  = round(subtotal + impuestoArea);

    // Tasas para desglose informativo
    const tasasQuery = await this.dataSource.query<
      { impuesto_id: number; nombre: string; porcentaje: string }[]
    >(
      `
      SELECT DISTINCT ON (si.impuesto_id)
        si.impuesto_id,
        i.nombre,
        i.porcentaje
      FROM public.sucursal_impuestos si
      INNER JOIN public.impuestos i ON i.id = si.impuesto_id
      ${sucursalImpuestoCondicion}
      ORDER BY si.impuesto_id, si.orden_aplicacion
      `,
    );

    const impuestosDetalle = tasasQuery.map((t) => ({
      impuesto_id: t.impuesto_id,
      nombre: t.nombre,
      porcentaje: Number(t.porcentaje),
      monto: round(subtotal * (Number(t.porcentaje) / 100)),
    }));

    return {
      periodo: { fecha_inicio, fecha_fin },
      area,
      ...(sucursal_id ? { sucursal_id } : {}),
      resumen: {
        total_ordenes: Number(row?.total_ordenes ?? 0),
        subtotal: round(subtotal),
        impuestos: round(impuestoArea),
        total_ventas: totalVentas,
      },
      impuestos_detalle: impuestosDetalle,
      por_forma_pago: [],
    };
  }

  async auditoria(filtros: {
    fecha_inicio?: string;
    fecha_fin?: string;
    usuario_id?: number;
    estado?: string;
    sucursal_id?: number;
  }) {
    try {
      const conditions: string[] = [];
      const params: any[]        = [];
      let idx = 1;

      if (filtros.fecha_inicio) {
        conditions.push(`o.fecha_apertura >= $${idx++}`);
        params.push(filtros.fecha_inicio);
      }
      if (filtros.fecha_fin) {
        conditions.push(`o.fecha_apertura <= $${idx++}`);
        params.push(`${filtros.fecha_fin} 23:59:59`);
      }
      if (filtros.usuario_id) {
        conditions.push(`o.usuario_id = $${idx++}`);
        params.push(filtros.usuario_id);
      }
      if (filtros.estado) {
        conditions.push(`o.estado = $${idx++}`);
        params.push(filtros.estado);
      }
      if (filtros.sucursal_id) {
        conditions.push(`o.sucursal_id = $${idx++}`);
        params.push(filtros.sucursal_id);
      }

      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const rows = await this.dataSource.query(
        `
        SELECT
          o.id                                          AS orden_id,
          o.numero_orden,
          m.nombre                                      AS mesa,
          CONCAT(u.nombre, ' ', COALESCE(u.apellido,'')) AS camarero,
          o.estado,
          o.subtotal,
          o.impuestos_total,
          o.total,
          o.fecha_apertura,
          o.fecha_cierre,
          o.notas,
          f.numero_factura,
          f.anulada                                     AS factura_anulada,
          COALESCE(
            json_agg(
              json_build_object(
                'forma_pago', fp.nombre,
                'monto', op.monto,
                'referencia', op.referencia
              )
            ) FILTER (WHERE op.id IS NOT NULL),
            '[]'
          )                                             AS pagos
        FROM public.ordenes o
        LEFT JOIN public.mesas       m  ON m.id  = o.mesa_id
        LEFT JOIN public.usuarios    u  ON u.id  = o.usuario_id
        LEFT JOIN public.facturas    f  ON f.orden_id = o.id
        LEFT JOIN public.orden_pagos op ON op.orden_id = o.id
        LEFT JOIN public.formas_pago fp ON fp.id = op.forma_pago_id
        ${where}
        GROUP BY o.id, m.nombre, u.nombre, u.apellido, f.numero_factura, f.anulada
        ORDER BY o.fecha_apertura DESC
        LIMIT 500
        `,
        params,
      );

      return rows;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        `Error al generar la auditoría: ${msg}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async auditoriaDetalle(ordenId: number) {
    try {
      const [ordenRows, lineasRows, pagosRows] = await Promise.all([

        // ── 1. Orden + mesa + camarero + factura ──────────────────────────────
        this.dataSource.query(`
          SELECT
            o.id, o.numero_orden, o.estado, o.tipo_servicio, o.notas,
            o.subtotal, o.impuestos_total, o.total,
            o.fecha_apertura, o.fecha_cierre,
            m.nombre                                         AS mesa,
            CONCAT(u.nombre,' ',COALESCE(u.apellido,''))     AS camarero,
            f.id                                             AS factura_id,
            f.numero_factura,
            f.anulada                                        AS factura_anulada,
            f.agregado_en                                    AS factura_fecha
          FROM public.ordenes o
          LEFT JOIN public.mesas    m ON m.id = o.mesa_id
          LEFT JOIN public.usuarios u ON u.id = o.usuario_id
          LEFT JOIN public.facturas f ON f.orden_id = o.id
          WHERE o.id = $1
        `, [ordenId]),

        // ── 2. Líneas + artículo + modificadores + KDS ───────────────────────
        this.dataSource.query(`
          SELECT
            ol.id, ol.cantidad, ol.precio_unitario, ol.subtotal_linea,
            ol.estado, ol.enviado_a_cocina, ol.fecha_envio,
            ol.cuenta_num, ol.notas_linea, ol.agregado_en,
            a.nombre AS articulo_nombre,
            COALESCE(
              json_agg(DISTINCT jsonb_build_object(
                'nombre',       mod.nombre,
                'precio_extra', olm.precio_extra
              )) FILTER (WHERE olm.id IS NOT NULL), '[]'
            ) AS modificadores,
            COALESCE(
              json_agg(DISTINCT jsonb_build_object(
                'destino',          d.nombre,
                'estado',           k.estado,
                'tiempo_recibido',  k.tiempo_recibido,
                'tiempo_preparado', k.tiempo_preparado
              )) FILTER (WHERE k.id IS NOT NULL), '[]'
            ) AS kds
          FROM public.orden_lineas ol
          LEFT JOIN public.articulos                  a   ON a.id   = ol.articulo_id
          LEFT JOIN public.orden_linea_modificadores  olm ON olm.orden_linea_id  = ol.id
          LEFT JOIN public.modificadores              mod ON mod.id             = olm.modificador_id
          LEFT JOIN public.kds_ordenes                k   ON k.orden_linea_id   = ol.id
          LEFT JOIN public.destinos_impresion         d   ON d.id               = k.destino_id
          WHERE ol.orden_id = $1
          GROUP BY ol.id, a.nombre
          ORDER BY ol.agregado_en ASC
        `, [ordenId]),

        // ── 3. Pagos + forma + turno de caja ─────────────────────────────────
        this.dataSource.query(`
          SELECT
            op.id, op.monto, op.referencia, op.agregado_en,
            fp.nombre                                        AS forma_pago,
            tc.id                                            AS turno_id,
            tc.fecha_apertura                                AS turno_apertura,
            tc.fecha_cierre                                  AS turno_cierre,
            tc.monto_apertura                                AS turno_monto_apertura,
            CONCAT(uc.nombre,' ',COALESCE(uc.apellido,''))   AS cajero
          FROM public.orden_pagos op
          LEFT JOIN public.formas_pago fp ON fp.id = op.forma_pago_id
          LEFT JOIN public.turnos_caja tc ON (
            tc.fecha_apertura <= op.agregado_en
            AND (tc.fecha_cierre IS NULL OR tc.fecha_cierre >= op.agregado_en)
          )
          LEFT JOIN public.usuarios uc ON uc.id = tc.usuario_id
          WHERE op.orden_id = $1
          ORDER BY op.agregado_en ASC
        `, [ordenId]),
      ]);

      if (!ordenRows.length) {
        throw new HttpException(`Orden ${ordenId} no encontrada`, HttpStatus.NOT_FOUND);
      }

      return {
        orden:  ordenRows[0],
        lineas: lineasRows,
        pagos:  pagosRows,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        `Error al obtener detalle de auditoría: ${msg}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

function round(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

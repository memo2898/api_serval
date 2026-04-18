import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ReporteVentasDto } from './dto/reporte-ventas.dto';

@Injectable()
export class ReportesService {
  constructor(private readonly dataSource: DataSource) {}

  async ventasPorRango(filtros: ReporteVentasDto) {
    try {
      const { fecha_inicio, fecha_fin, sucursal_id } = filtros;

      const fechaFinDia = `${fecha_fin} 23:59:59`;
      const sucursalCondicion = sucursal_id ? `AND o.sucursal_id = ${sucursal_id}` : '';
      const sucursalImpuestoCondicion = sucursal_id ? `WHERE si.sucursal_id = ${sucursal_id}` : '';

      // Total de ventas desde pagos reales
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

      // Tasas de impuestos configuradas para la(s) sucursal(es)
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

      // Cálculo reverso: subtotal = total / (1 + suma_de_tasas)
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

      // Desglose por forma de pago
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
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        `Error al generar el reporte de ventas: ${msg}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

function round(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

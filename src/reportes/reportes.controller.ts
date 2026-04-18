import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';
import { ReporteVentasDto } from './dto/reporte-ventas.dto';

@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('ventas')
  @ApiOperation({
    summary: 'Reporte de ventas por rango de fecha',
    description:
      'Retorna el resumen de ventas (total de órdenes, subtotal, impuestos, descuentos y total) ' +
      'y el desglose por forma de pago para el rango de fechas indicado. ' +
      'Solo incluye órdenes con estado "cobrada".',
  })
  @ApiQuery({ name: 'fecha_inicio', required: true,  type: String, example: '2025-01-01', description: 'Fecha inicio del rango (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fecha_fin',    required: true,  type: String, example: '2025-01-31', description: 'Fecha fin del rango (YYYY-MM-DD)' })
  @ApiQuery({ name: 'sucursal_id',  required: false, type: Number, example: 1,            description: 'Filtrar por sucursal (opcional)' })
  @ApiResponse({
    status: 200,
    description: 'Reporte generado exitosamente.',
    schema: {
      example: {
        periodo: { fecha_inicio: '2025-01-01', fecha_fin: '2025-01-31' },
        resumen: {
          total_ordenes: 150,
          subtotal: 10000.00,
          descuentos: 500.00,
          impuestos: 1300.00,
          total_ventas: 10800.00,
        },
        por_forma_pago: [
          { forma_pago_id: 1, forma_pago: 'Efectivo', total: 6000.00, cantidad_transacciones: 90 },
          { forma_pago_id: 2, forma_pago: 'Tarjeta',  total: 4800.00, cantidad_transacciones: 60 },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos.' })
  @ApiResponse({ status: 500, description: 'Error al generar el reporte.' })
  ventasPorRango(@Query() filtros: ReporteVentasDto) {
    return this.reportesService.ventasPorRango(filtros);
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─── Conexión ─────────────────────────────────────────────────────────────────

export class HandshakeAuthDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT del usuario' })
  token: string;

  @ApiProperty({ example: 1, description: 'ID de la sucursal a la que se conecta' })
  sucursal_id: number;

  @ApiProperty({
    example: 'mesas',
    enum: ['mesas', 'cocina', 'barra', 'caja'],
    description: 'Rol funcional del cliente',
  })
  rol: string;
}

// ─── Mesas — cliente → servidor ───────────────────────────────────────────────

export class MesaUsuarioEntroDto {
  @ApiProperty({ example: 5, description: 'ID de la mesa que abre el camarero' })
  mesa_id: number;
}

export class MesaUsuarioSalioDto {
  @ApiProperty({ example: 5, description: 'ID de la mesa que cierra el camarero' })
  mesa_id: number;
}

// ─── Mesas — servidor → cliente ───────────────────────────────────────────────

export class MesaUsuarioEntroEventDto {
  @ApiProperty({ example: 5 })
  mesa_id: number;

  @ApiProperty({ example: 12 })
  usuario_id: number;

  @ApiProperty({ example: 'Carlos Perez' })
  nombre: string;

  @ApiProperty({ example: '2026-04-15T14:30:00.000Z' })
  timestamp: string;
}

export class MesaPresenciaActualEventDto {
  @ApiProperty({
    example: [
      { mesa_id: 5, usuarios: [{ usuario_id: 12, nombre: 'Carlos' }] },
      { mesa_id: 8, usuarios: [{ usuario_id: 7, nombre: 'Maria' }] },
    ],
  })
  presencias: object[];
}

export class MesaEstadoCambioEventDto {
  @ApiProperty({ example: 5 })
  mesa_id: number;

  @ApiProperty({ example: 'libre' })
  estado_anterior: string;

  @ApiProperty({ example: 'ocupada' })
  estado_nuevo: string;

  @ApiPropertyOptional({ example: 88 })
  orden_id: number | null;

  @ApiProperty({ example: '2026-04-15T14:30:00.000Z' })
  timestamp: string;
}

// ─── KDS — cliente → servidor ─────────────────────────────────────────────────

export class OrdenEnviarCocinaDto {
  @ApiProperty({ example: 88, description: 'ID de la orden' })
  orden_id: number;

  @ApiProperty({ example: [210, 211, 212], description: 'IDs de las líneas a enviar' })
  linea_ids: number[];
}

export class KdsLineaEnPreparacionDto {
  @ApiProperty({ example: 45, description: 'ID del registro en kds_ordenes' })
  kds_orden_id: number;
}

export class KdsLineaListaDto {
  @ApiProperty({ example: 45, description: 'ID del registro en kds_ordenes' })
  kds_orden_id: number;
}

// ─── KDS — servidor → cliente ─────────────────────────────────────────────────

export class KdsNuevaLineaEventDto {
  @ApiProperty({ example: 45, description: 'ID del primer kds_ordene del batch' })
  kds_orden_id: number;

  @ApiProperty({ example: 88 })
  orden_id: number;

  @ApiProperty({ example: 'Mesa 4' })
  mesa: string;

  @ApiProperty({ example: 38 })
  numero_orden: number;

  @ApiProperty({ example: 'mesa', enum: ['mesa', 'llevar', 'domicilio'] })
  tipo_servicio: string;

  @ApiProperty({ example: '2026-04-15T14:32:00.000Z' })
  tiempo_recibido: string;

  @ApiProperty({ example: 'normal', enum: ['normal', 'urgente'] })
  prioridad: string;

  @ApiProperty({
    example: [
      {
        kds_orden_id: 45,
        orden_linea_id: 88,
        articulo: 'Hamburguesa clasica',
        cantidad: 2,
        notas_linea: 'Sin cebolla',
        modificadores: ['Termino medio', 'Extra queso'],
        tiempo_preparacion: 12,
      },
    ],
  })
  lineas: object[];
}

export class KdsLineasConfirmadasEventDto {
  @ApiProperty({ example: 88 })
  orden_id: number;

  @ApiProperty({ example: [210, 211, 212] })
  lineas_enviadas: number[];

  @ApiProperty({ example: { cocina: [210, 211], barra: [212] } })
  destinos: object;
}

export class KdsOrdenCompletaEventDto {
  @ApiProperty({ example: 88 })
  orden_id: number;

  @ApiPropertyOptional({ example: 5 })
  mesa_id: number | null;
}

// ─── Caja — servidor → cliente ────────────────────────────────────────────────

export class CajaOrdenListaCobrarEventDto {
  @ApiProperty({ example: 88 })
  orden_id: number;

  @ApiProperty({ example: 'Mesa 4' })
  mesa: string;

  @ApiPropertyOptional({ example: 5 })
  mesa_id: number | null;

  @ApiProperty({ example: 1250.0 })
  total: number;

  @ApiProperty({ example: 1086.96 })
  subtotal: number;

  @ApiProperty({ example: 163.04 })
  impuestos: number;

  @ApiProperty({ example: 0 })
  descuento_total: number;

  @ApiPropertyOptional({ example: 38 })
  numero_orden: number | null;

  @ApiProperty({ example: 'mesa' })
  tipo_servicio: string;

  @ApiProperty({ example: '2026-04-15T15:10:00.000Z' })
  timestamp: string;
}

export class CajaPagoRegistradoEventDto {
  @ApiProperty({ example: 88 })
  orden_id: number;

  @ApiProperty({ example: 'efectivo' })
  forma_pago: string;

  @ApiProperty({ example: 1250.0 })
  monto: number;

  @ApiPropertyOptional({ example: null })
  referencia: string | null;

  @ApiProperty({ example: 0 })
  saldo_pendiente: number;

  @ApiProperty({ example: 'cobrada' })
  estado_orden: string;
}

export class CajaTurnoEventDto {
  @ApiProperty({ example: 7 })
  turno_id: number;

  @ApiProperty({ example: 2 })
  terminal_id: number;

  @ApiProperty({ example: 12 })
  usuario_id: number;

  @ApiProperty({ example: '2026-04-15T08:00:00.000Z' })
  timestamp: string;
}

export class CajaOrdenAnuladaEventDto {
  @ApiProperty({ example: 88 })
  orden_id: number;

  @ApiPropertyOptional({ example: 5 })
  mesa_id: number | null;

  @ApiProperty({ example: 'Error de captura' })
  motivo: string;

  @ApiProperty({ example: '2026-04-15T15:30:00.000Z' })
  timestamp: string;
}

// ─── Error ────────────────────────────────────────────────────────────────────

export class ErrorEventoDto {
  @ApiProperty({ example: 'orden:enviar_a_cocina' })
  evento_original: string;

  @ApiProperty({ example: 'ORDEN_NO_ENCONTRADA' })
  codigo: string;

  @ApiProperty({ example: 'La orden 88 no existe o no pertenece a esta sucursal' })
  mensaje: string;
}

import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../services/rooms.service';

@Injectable()
export class CajaHandler {
  constructor(private readonly roomsService: RoomsService) {}

  // Emitido desde el Gateway cuando la REST API registra un pago
  emitPagoRegistrado(
    sucursal_id: number,
    payload: {
      orden_id: number;
      forma_pago: string;
      monto: number;
      referencia: string | null;
      saldo_pendiente: number;
      estado_orden: string;
    },
  ) {
    this.roomsService.toCaja(sucursal_id).emit('caja:pago_registrado', payload);
    this.roomsService.toMesas(sucursal_id).emit('caja:pago_registrado', payload);
  }

  // Emitido cuando una orden pasa a estado por_cobrar
  emitOrdenListaCobrar(
    sucursal_id: number,
    payload: {
      orden_id: number;
      mesa: string;
      mesa_id: number | null;
      total: number;
      subtotal: number;
      impuestos: number;
      descuento_total: number;
      numero_orden: number | null;
      tipo_servicio: string;
      timestamp: string;
    },
  ) {
    this.roomsService.toCaja(sucursal_id).emit('caja:orden_lista_cobrar', payload);
  }

  // Emitido cuando se abre un turno de caja
  emitTurnoAbierto(sucursal_id: number, payload: { turno_id: number; terminal_id: number; usuario_id: number; timestamp: string }) {
    this.roomsService.toCaja(sucursal_id).emit('caja:turno_abierto', payload);
  }

  // Emitido cuando se cierra un turno de caja
  emitTurnoCerrado(sucursal_id: number, payload: { turno_id: number; terminal_id: number; usuario_id: number; timestamp: string }) {
    this.roomsService.toCaja(sucursal_id).emit('caja:turno_cerrado', payload);
  }

  // Emitido cuando se emite una factura o ticket
  emitFacturaEmitida(sucursal_id: number, payload: { factura_id: number; orden_id: number; timestamp: string }) {
    this.roomsService.toCaja(sucursal_id).emit('caja:factura_emitida', payload);
  }

  // Emitido cuando una orden es anulada
  emitOrdenAnulada(sucursal_id: number, payload: { orden_id: number; mesa_id: number | null; motivo: string; timestamp: string }) {
    this.roomsService.toCaja(sucursal_id).emit('caja:orden_anulada', payload);
    this.roomsService.toMesas(sucursal_id).emit('caja:orden_anulada', payload);
  }

  // Handler del cliente caja (si la caja emite algo al servidor)
  handleClienteCajaEvento(_client: Socket, _data: unknown, _server: Server) {
    // Placeholder para eventos que la caja pueda emitir en el futuro
  }
}

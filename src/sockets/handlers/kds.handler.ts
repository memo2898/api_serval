import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { KdsSocketService } from '../services/kds-socket.service';

@Injectable()
export class KdsHandler {
  constructor(private readonly kdsSocketService: KdsSocketService) {}

  async handleEnviarCocina(
    client: Socket,
    data: { orden_id: number; linea_ids: number[] },
    server: Server,
  ) {
    const { sucursal_id } = client.data as { sucursal_id: number };

    try {
      const result = await this.kdsSocketService.enviarAKds(data, sucursal_id);

      if (result.payloadCocina) {
        server
          .to(`sucursal_${sucursal_id}_cocina`)
          .emit('kds:nueva_linea', result.payloadCocina);
      }

      if (result.payloadBarra) {
        server
          .to(`sucursal_${sucursal_id}_barra`)
          .emit('kds:nueva_linea', result.payloadBarra);
      }

      client.emit('orden:lineas_confirmadas', result.confirmacion);
    } catch (e: any) {
      client.emit('error:evento', {
        evento_original: 'orden:enviar_a_cocina',
        codigo: e.message ?? 'ERROR_DESCONOCIDO',
        mensaje: e.message ?? 'Error al enviar la orden',
      });
    }
  }

  async handleLineaEnPreparacion(
    client: Socket,
    data: { kds_orden_id: number },
    server: Server,
  ) {
    const { usuario_id } = client.data as { usuario_id: number };

    try {
      const result = await this.kdsSocketService.lineaEnPreparacion(
        data.kds_orden_id,
        usuario_id,
      );

      server
        .to(`sucursal_${result.sucursal_id}_mesas`)
        .emit('kds:linea_en_preparacion', result.payload);
    } catch (e: any) {
      client.emit('error:evento', {
        evento_original: 'kds:linea_en_preparacion',
        codigo: e.message ?? 'ERROR_DESCONOCIDO',
        mensaje: e.message ?? 'Error al marcar linea en preparacion',
      });
    }
  }

  async handleLineaLista(client: Socket, data: { kds_orden_id: number }, server: Server) {
    try {
      const result = await this.kdsSocketService.lineaLista(data.kds_orden_id);

      // Notificar a mesas que la linea esta lista
      server
        .to(`sucursal_${result.sucursal_id}_mesas`)
        .emit('kds:linea_lista', result.payload);

      // Batch completo → avisar al camarero qué recoger
      if (result.batchCompleto) {
        server
          .to(`sucursal_${result.sucursal_id}_mesas`)
          .emit('kds:batch_listo', {
            id:              `${result.orden_id}_${result.sucursal_id}_${Date.now()}`,
            orden_id:        result.orden_id,
            mesa_id:         result.mesa_id,
            mesa:            result.mesa,
            articulos:       result.batchArticulos,
            orden_linea_ids: result.batchOrdenLineaIds,
          });
      }

      // Si todas las lineas de la orden estan listas, emitir orden_completa
      if (result.ordenCompleta) {
        const completaPayload = { orden_id: result.orden_id, mesa_id: result.mesa_id };

        if (result.destinoTipo) {
          server
            .to(`sucursal_${result.sucursal_id}_${result.destinoTipo}`)
            .emit('kds:orden_completa', completaPayload);
        }

        server
          .to(`sucursal_${result.sucursal_id}_mesas`)
          .emit('kds:orden_completa', completaPayload);
      }
    } catch (e: any) {
      client.emit('error:evento', {
        evento_original: 'kds:linea_lista',
        codigo: e.message ?? 'ERROR_DESCONOCIDO',
        mensaje: e.message ?? 'Error al marcar linea como lista',
      });
    }
  }

  async handleBatchLista(
    client: Socket,
    data: { kds_orden_ids: number[] },
    server: Server,
  ) {
    try {
      const result = await this.kdsSocketService.batchLista(data.kds_orden_ids);
      if (!result) return;

      // Notificar a mesas: batch listo para recoger
      server
        .to(`sucursal_${result.sucursal_id}_mesas`)
        .emit('kds:batch_listo', {
          id:              `${result.orden_id}_${result.sucursal_id}_${Date.now()}`,
          orden_id:        result.orden_id,
          mesa_id:         result.mesa_id,
          mesa:            result.mesa,
          usuario_id:      result.usuario_id,
          articulos:       result.batchArticulos,
          orden_linea_ids: result.batchOrdenLineaIds,
        });

      // Notificar al propio KDS que las líneas están listas (para estado interno)
      result.payloads.forEach(p => {
        if (result.destinoTipo) {
          server
            .to(`sucursal_${result.sucursal_id}_${result.destinoTipo}`)
            .emit('kds:linea_lista', p);
        }
      });

      if (result.ordenCompleta) {
        const completaPayload = { orden_id: result.orden_id, mesa_id: result.mesa_id };
        if (result.destinoTipo) {
          server
            .to(`sucursal_${result.sucursal_id}_${result.destinoTipo}`)
            .emit('kds:orden_completa', completaPayload);
        }
        server
          .to(`sucursal_${result.sucursal_id}_mesas`)
          .emit('kds:orden_completa', completaPayload);
      }
    } catch (e: any) {
      client.emit('error:evento', {
        evento_original: 'kds:batch_lista',
        codigo:  e.message ?? 'ERROR_DESCONOCIDO',
        mensaje: e.message ?? 'Error al marcar batch como listo',
      });
    }
  }

  async handleLineasEntregadas(
    client: Socket,
    data: { orden_linea_ids: number[] },
    server: Server,
  ) {
    try {
      const result = await this.kdsSocketService.marcarLineasEntregadas(data.orden_linea_ids);
      if (!result) return;
      const entregadasPayload = {
        orden_id:        result.orden_id,
        mesa_id:         result.mesa_id,
        orden_linea_ids: result.orden_linea_ids,
      };
      server.to(`sucursal_${result.sucursal_id}_mesas`).emit('kds:lineas_entregadas', entregadasPayload);
      server.to(`sucursal_${result.sucursal_id}_caja`).emit('kds:lineas_entregadas', entregadasPayload);
    } catch (e: any) {
      client.emit('error:evento', {
        evento_original: 'kds:lineas_entregadas',
        codigo: e.message ?? 'ERROR_DESCONOCIDO',
        mensaje: e.message ?? 'Error al marcar líneas como entregadas',
      });
    }
  }
}

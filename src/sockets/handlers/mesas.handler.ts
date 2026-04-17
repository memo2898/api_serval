import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PresenciaService } from '../services/presencia.service';

@Injectable()
export class MesasHandler {
  constructor(private readonly presenciaService: PresenciaService) {}

  handleUsuarioEntro(client: Socket, data: { mesa_id: number; personas?: number }, server: Server) {
    const { usuario_id, nombre, rol, sucursal_id } = client.data as {
      usuario_id: number;
      nombre: string;
      rol: string;
      sucursal_id: number;
    };

    this.presenciaService.registrar(client.id, usuario_id, nombre, rol, sucursal_id, data.mesa_id);

    server.to(`sucursal_${sucursal_id}_mesas`).emit('mesa:usuario_entro', {
      mesa_id: data.mesa_id,
      usuario_id,
      nombre,
      rol,
      timestamp: new Date().toISOString(),
    });

    // Broadcast del cambio de estado para actualizar el floor plan en todos los clientes
    server.to(`sucursal_${sucursal_id}_mesas`).emit('mesa:estado_cambio', {
      mesa_id: data.mesa_id,
      estado: 'ocupada',
      ...(data.personas !== undefined ? { personas: data.personas } : {}),
    });
  }

  handleUsuarioSalio(client: Socket, data: { mesa_id: number }, server: Server) {
    const { usuario_id, sucursal_id } = client.data as {
      usuario_id: number;
      sucursal_id: number;
    };

    this.presenciaService.salirMesa(client.id, data.mesa_id);

    server.to(`sucursal_${sucursal_id}_mesas`).emit('mesa:usuario_salio', {
      mesa_id: data.mesa_id,
      usuario_id,
    });
  }

  limpiarPresencias(client: Socket, server: Server) {
    const datos = this.presenciaService.getSalida(client.id);
    const { usuario_id, sucursal_id, mesas } = datos;

    for (const mesa_id of mesas) {
      server.to(`sucursal_${sucursal_id}_mesas`).emit('mesa:usuario_salio', {
        mesa_id,
        usuario_id,
      });
    }

    this.presenciaService.limpiar(client.id);
  }
}

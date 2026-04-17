import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class RoomsService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  toSucursal(sucursal_id: number) {
    return this.server.to(`sucursal_${sucursal_id}`);
  }

  toMesas(sucursal_id: number) {
    return this.server.to(`sucursal_${sucursal_id}_mesas`);
  }

  toCocina(sucursal_id: number) {
    return this.server.to(`sucursal_${sucursal_id}_cocina`);
  }

  toBarra(sucursal_id: number) {
    return this.server.to(`sucursal_${sucursal_id}_barra`);
  }

  toCaja(sucursal_id: number) {
    return this.server.to(`sucursal_${sucursal_id}_caja`);
  }

  toRoom(room: string) {
    return this.server.to(room);
  }
}

import { Injectable } from '@nestjs/common';

interface PresenciaData {
  usuario_id: number;
  nombre: string;
  rol: string;
  sucursal_id: number;
  mesas: number[];
}

@Injectable()
export class PresenciaService {
  private presencias = new Map<string, PresenciaData>();

  registrar(socket_id: string, usuario_id: number, nombre: string, rol: string, sucursal_id: number, mesa_id: number) {
    const existing = this.presencias.get(socket_id);
    if (existing) {
      if (!existing.mesas.includes(mesa_id)) {
        existing.mesas.push(mesa_id);
      }
    } else {
      this.presencias.set(socket_id, { usuario_id, nombre, rol, sucursal_id, mesas: [mesa_id] });
    }
  }

  salirMesa(socket_id: string, mesa_id: number) {
    const existing = this.presencias.get(socket_id);
    if (existing) {
      existing.mesas = existing.mesas.filter((m) => m !== mesa_id);
    }
  }

  getSalida(socket_id: string): PresenciaData {
    return this.presencias.get(socket_id) ?? { usuario_id: 0, nombre: '', rol: '', sucursal_id: 0, mesas: [] };
  }

  limpiar(socket_id: string) {
    this.presencias.delete(socket_id);
  }

  getAll(sucursal_id: number) {
    const result: Record<number, { usuario_id: number; nombre: string; rol: string }[]> = {};
    for (const [, data] of this.presencias) {
      if (data.sucursal_id !== sucursal_id) continue;
      for (const mesa_id of data.mesas) {
        if (!result[mesa_id]) result[mesa_id] = [];
        result[mesa_id].push({ usuario_id: data.usuario_id, nombre: data.nombre, rol: data.rol });
      }
    }
    return Object.entries(result).map(([mesa_id, usuarios]) => ({
      mesa_id: Number(mesa_id),
      usuarios,
    }));
  }
}

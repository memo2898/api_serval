import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { PresenciaService } from './services/presencia.service';
import { RoomsService } from './services/rooms.service';
import { MesasHandler } from './handlers/mesas.handler';
import { KdsHandler } from './handlers/kds.handler';

@WebSocketGateway({ namespace: '/pos', cors: { origin: '*' } })
export class SocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(SocketsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usuariosService: UsuariosService,
    private readonly presenciaService: PresenciaService,
    private readonly roomsService: RoomsService,
    private readonly mesasHandler: MesasHandler,
    private readonly kdsHandler: KdsHandler,
  ) {}

  afterInit(server: Server) {
    this.roomsService.setServer(server);
    this.logger.log('SocketsGateway iniciado — namespace /pos');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;
      if (!token) {
        this.logger.warn(`[${client.id}] Conexion rechazada: sin token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token) as { sub: number; username: string };
      const user = await this.usuariosService.findOne(payload.sub);
      if (!user) {
        this.logger.warn(`[${client.id}] Conexion rechazada: usuario no encontrado`);
        client.disconnect();
        return;
      }

      const sucursal_id =
        Number(client.handshake.auth?.sucursal_id) || (user.sucursal_id ?? 0);
      const rol = (client.handshake.auth?.rol as string) || 'mesas';

      client.data = {
        usuario_id: user.id,
        nombre: user.nombre,
        sucursal_id,
        rol,
      };

      client.join(`sucursal_${sucursal_id}`);
      client.join(`sucursal_${sucursal_id}_${rol}`);

      if (rol === 'mesas') {
        const presencias = this.presenciaService.getAll(sucursal_id);
        client.emit('mesa:presencia_actual', { presencias });
      }

      this.logger.log(
        `[${client.id}] Conectado: ${user.nombre} | rol=${rol} | sucursal=${sucursal_id}`,
      );
    } catch (e) {
      this.logger.warn(`[${client.id}] Error de autenticacion: ${(e as Error).message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.mesasHandler.limpiarPresencias(client, this.server);
    this.logger.log(`[${client.id}] Desconectado`);
  }

  // ─── Mesas ───────────────────────────────────────────────────────────────

  @SubscribeMessage('mesa:usuario_entro')
  onUsuarioEntro(client: Socket, data: { mesa_id: number }) {
    this.mesasHandler.handleUsuarioEntro(client, data, this.server);
  }

  @SubscribeMessage('mesa:usuario_salio')
  onUsuarioSalio(client: Socket, data: { mesa_id: number }) {
    this.mesasHandler.handleUsuarioSalio(client, data, this.server);
  }

  /**
   * Broadcast del merge de mesas: notifica a todos los clientes del floor plan
   * que las mesas secundarias cambiaron a estado 'ocupada' y quedaron vinculadas
   * a la principal (mesa_principal_id).
   */
  @SubscribeMessage('mesa:mesas_unidas')
  onMesasUnidas(
    client: Socket,
    data: { principal_id: number; mesas_ids: number[] },
  ) {
    const { sucursal_id } = client.data as { sucursal_id: number };
    for (const mesa_id of data.mesas_ids) {
      this.server.to(`sucursal_${sucursal_id}_mesas`).emit('mesa:estado_cambio', {
        mesa_id,
        estado: 'ocupada',
        mesa_principal_id: data.principal_id,
      });
    }
  }

  /**
   * Relay de sincronización de líneas: rebroadcast a los demás clientes del mismo
   * floor-plan (excluyendo al emisor) para que vean en tiempo real los artículos
   * agregados/modificados/eliminados por otro camarero en la misma mesa.
   */
  @SubscribeMessage('orden:linea_sincronizada')
  onLineaSincronizada(client: Socket, data: unknown) {
    const { sucursal_id } = client.data as { sucursal_id: number };
    client.to(`sucursal_${sucursal_id}_mesas`).emit('orden:linea_sincronizada', data as any);
  }

  // ─── KDS ─────────────────────────────────────────────────────────────────

  @SubscribeMessage('orden:enviar_a_cocina')
  async onEnviarCocina(client: Socket, data: { orden_id: number; linea_ids: number[] }) {
    await this.kdsHandler.handleEnviarCocina(client, data, this.server);
  }

  @SubscribeMessage('kds:linea_en_preparacion')
  async onLineaEnPreparacion(client: Socket, data: { kds_orden_id: number }) {
    await this.kdsHandler.handleLineaEnPreparacion(client, data, this.server);
  }

  @SubscribeMessage('kds:linea_lista')
  async onLineaLista(client: Socket, data: { kds_orden_id: number }) {
    await this.kdsHandler.handleLineaLista(client, data, this.server);
  }

  @SubscribeMessage('kds:batch_lista')
  async onBatchLista(client: Socket, data: { kds_orden_ids: number[] }) {
    await this.kdsHandler.handleBatchLista(client, data, this.server);
  }

  @SubscribeMessage('kds:lineas_entregadas')
  async onLineasEntregadas(client: Socket, data: { orden_linea_ids: number[] }) {
    await this.kdsHandler.handleLineasEntregadas(client, data, this.server);
  }
}

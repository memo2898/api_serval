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
}

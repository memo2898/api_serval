import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

// Entidades que necesita KdsSocketService
import { OrdenLinea } from '../orden_lineas/entities/orden_linea.entity';
import { KdsOrdene } from '../kds_ordenes/entities/kds_ordene.entity';
import { Ordene } from '../ordenes/entities/ordene.entity';
import { DestinosImpresion } from '../destinos_impresion/entities/destinos_impresion.entity';
import { OrdenLineaModificadore } from '../orden_linea_modificadores/entities/orden_linea_modificadore.entity';
import { Mesa } from '../mesas/entities/mesa.entity';

// Servicios
import { PresenciaService } from './services/presencia.service';
import { RoomsService } from './services/rooms.service';
import { KdsSocketService } from './services/kds-socket.service';

// Handlers
import { MesasHandler } from './handlers/mesas.handler';
import { KdsHandler } from './handlers/kds.handler';
import { CajaHandler } from './handlers/caja.handler';

// Gateway principal
import { SocketsGateway } from './sockets.gateway';
import { SocketsDocsController } from './sockets-docs.controller';

@Module({
  imports: [
    AuthModule,
    UsuariosModule,
    TypeOrmModule.forFeature([
      OrdenLinea,
      KdsOrdene,
      Ordene,
      DestinosImpresion,
      OrdenLineaModificadore,
      Mesa,
    ]),
  ],
  controllers: [SocketsDocsController],
  providers: [
    PresenciaService,
    RoomsService,
    KdsSocketService,
    MesasHandler,
    KdsHandler,
    CajaHandler,
    SocketsGateway,
  ],
  exports: [RoomsService, CajaHandler],
})
export class SocketsModule {}

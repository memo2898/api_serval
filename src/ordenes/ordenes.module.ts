import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { Ordene } from './entities/ordene.entity';
import { OrdenLineasModule } from '../orden_lineas/orden_lineas.module';
import { OrdenPagosModule } from '../orden_pagos/orden_pagos.module';
import { SocketsModule } from '../sockets/sockets.module';
import { FacturasModule } from '../facturas/facturas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ordene]), OrdenLineasModule, OrdenPagosModule, SocketsModule, FacturasModule],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}

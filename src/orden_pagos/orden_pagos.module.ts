import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenPagosService } from './orden_pagos.service';
import { OrdenPagosController } from './orden_pagos.controller';
import { OrdenPago } from './entities/orden_pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenPago])],
  controllers: [OrdenPagosController],
  providers: [OrdenPagosService],
  exports:   [OrdenPagosService],
})
export class OrdenPagosModule {}

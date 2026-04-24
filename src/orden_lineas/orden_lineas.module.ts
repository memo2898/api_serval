import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenLineasService } from './orden_lineas.service';
import { OrdenLineasController } from './orden_lineas.controller';
import { OrdenLinea } from './entities/orden_linea.entity';
import { OrdenLineaModificadore } from '../orden_linea_modificadores/entities/orden_linea_modificadore.entity';
import { KdsOrdenesModule } from '../kds_ordenes/kds_ordenes.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenLinea, OrdenLineaModificadore]), KdsOrdenesModule],
  controllers: [OrdenLineasController],
  providers: [OrdenLineasService],
  exports: [OrdenLineasService],
})
export class OrdenLineasModule {}

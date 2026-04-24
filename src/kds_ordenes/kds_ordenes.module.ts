import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KdsOrdenesService } from './kds_ordenes.service';
import { KdsOrdenesController } from './kds_ordenes.controller';
import { KdsOrdene } from './entities/kds_ordene.entity';
import { OrdenLineaModificadore } from '../orden_linea_modificadores/entities/orden_linea_modificadore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KdsOrdene, OrdenLineaModificadore])],
  controllers: [KdsOrdenesController],
  providers: [KdsOrdenesService],
  exports: [KdsOrdenesService],
})
export class KdsOrdenesModule {}

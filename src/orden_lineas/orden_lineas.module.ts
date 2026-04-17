import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenLineasService } from './orden_lineas.service';
import { OrdenLineasController } from './orden_lineas.controller';
import { OrdenLinea } from './entities/orden_linea.entity';
import { OrdenLineaModificadore } from '../orden_linea_modificadores/entities/orden_linea_modificadore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenLinea, OrdenLineaModificadore])],
  controllers: [OrdenLineasController],
  providers: [OrdenLineasService],
  exports: [OrdenLineasService],
})
export class OrdenLineasModule {}

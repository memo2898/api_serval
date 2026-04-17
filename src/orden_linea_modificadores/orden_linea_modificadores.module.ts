import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenLineaModificadoresService } from './orden_linea_modificadores.service';
import { OrdenLineaModificadoresController } from './orden_linea_modificadores.controller';
import { OrdenLineaModificadore } from './entities/orden_linea_modificadore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenLineaModificadore])],
  controllers: [OrdenLineaModificadoresController],
  providers: [OrdenLineaModificadoresService],

})
export class OrdenLineaModificadoresModule {}

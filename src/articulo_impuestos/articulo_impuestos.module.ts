import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticuloImpuestosService } from './articulo_impuestos.service';
import { ArticuloImpuestosController } from './articulo_impuestos.controller';
import { ArticuloImpuesto } from './entities/articulo_impuesto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticuloImpuesto])],
  controllers: [ArticuloImpuestosController],
  providers: [ArticuloImpuestosService],

})
export class ArticuloImpuestosModule {}

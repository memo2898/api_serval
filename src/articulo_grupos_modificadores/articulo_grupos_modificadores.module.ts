import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticuloGruposModificadoresService } from './articulo_grupos_modificadores.service';
import { ArticuloGruposModificadoresController } from './articulo_grupos_modificadores.controller';
import { ArticuloGruposModificadore } from './entities/articulo_grupos_modificadore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticuloGruposModificadore])],
  controllers: [ArticuloGruposModificadoresController],
  providers: [ArticuloGruposModificadoresService],

})
export class ArticuloGruposModificadoresModule {}

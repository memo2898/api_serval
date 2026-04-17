import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticuloAlergenosService } from './articulo_alergenos.service';
import { ArticuloAlergenosController } from './articulo_alergenos.controller';
import { ArticuloAlergeno } from './entities/articulo_alergeno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticuloAlergeno])],
  controllers: [ArticuloAlergenosController],
  providers: [ArticuloAlergenosService],

})
export class ArticuloAlergenosModule {}

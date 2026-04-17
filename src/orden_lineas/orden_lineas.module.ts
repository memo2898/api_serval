import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenLineasService } from './orden_lineas.service';
import { OrdenLineasController } from './orden_lineas.controller';
import { OrdenLinea } from './entities/orden_linea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenLinea])],
  controllers: [OrdenLineasController],
  providers: [OrdenLineasService],

})
export class OrdenLineasModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { Ordene } from './entities/ordene.entity';
import { OrdenLineasModule } from '../orden_lineas/orden_lineas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ordene]), OrdenLineasModule],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SucursalesService } from './sucursales.service';
import { SucursalesController } from './sucursales.controller';
import { Sucursale } from './entities/sucursale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sucursale])],
  controllers: [SucursalesController],
  providers: [SucursalesService],

})
export class SucursalesModule {}

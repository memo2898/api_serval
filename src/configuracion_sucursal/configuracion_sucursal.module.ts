import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionSucursalService } from './configuracion_sucursal.service';
import { ConfiguracionSucursalController } from './configuracion_sucursal.controller';
import { ConfiguracionSucursal } from './entities/configuracion_sucursal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracionSucursal])],
  controllers: [ConfiguracionSucursalController],
  providers: [ConfiguracionSucursalService],

})
export class ConfiguracionSucursalModule {}

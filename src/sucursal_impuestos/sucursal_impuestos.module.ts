import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SucursalImpuestosService } from './sucursal_impuestos.service';
import { SucursalImpuestosController } from './sucursal_impuestos.controller';
import { SucursalImpuesto } from './entities/sucursal_impuesto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SucursalImpuesto])],
  controllers: [SucursalImpuestosController],
  providers: [SucursalImpuestosService],

})
export class SucursalImpuestosModule {}

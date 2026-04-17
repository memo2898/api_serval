import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreciosPorTarifaService } from './precios_por_tarifa.service';
import { PreciosPorTarifaController } from './precios_por_tarifa.controller';
import { PreciosPorTarifa } from './entities/precios_por_tarifa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PreciosPorTarifa])],
  controllers: [PreciosPorTarifaController],
  providers: [PreciosPorTarifaService],

})
export class PreciosPorTarifaModule {}

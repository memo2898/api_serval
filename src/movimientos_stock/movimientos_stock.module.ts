import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosStockService } from './movimientos_stock.service';
import { MovimientosStockController } from './movimientos_stock.controller';
import { MovimientosStock } from './entities/movimientos_stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientosStock])],
  controllers: [MovimientosStockController],
  providers: [MovimientosStockService],

})
export class MovimientosStockModule {}

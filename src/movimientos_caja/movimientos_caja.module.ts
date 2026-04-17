import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosCajaService } from './movimientos_caja.service';
import { MovimientosCajaController } from './movimientos_caja.controller';
import { MovimientosCaja } from './entities/movimientos_caja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientosCaja])],
  controllers: [MovimientosCajaController],
  providers: [MovimientosCajaService],

})
export class MovimientosCajaModule {}

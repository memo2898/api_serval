import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormasPagoService } from './formas_pago.service';
import { FormasPagoController } from './formas_pago.controller';
import { FormasPago } from './entities/formas_pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormasPago])],
  controllers: [FormasPagoController],
  providers: [FormasPagoService],

})
export class FormasPagoModule {}

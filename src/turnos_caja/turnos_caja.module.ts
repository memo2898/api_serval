import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosCajaService } from './turnos_caja.service';
import { TurnosCajaController } from './turnos_caja.controller';
import { TurnosCaja } from './entities/turnos_caja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TurnosCaja])],
  controllers: [TurnosCajaController],
  providers: [TurnosCajaService],

})
export class TurnosCajaModule {}

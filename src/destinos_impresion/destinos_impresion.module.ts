import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinosImpresionService } from './destinos_impresion.service';
import { DestinosImpresionController } from './destinos_impresion.controller';
import { DestinosImpresion } from './entities/destinos_impresion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DestinosImpresion])],
  controllers: [DestinosImpresionController],
  providers: [DestinosImpresionService],

})
export class DestinosImpresionModule {}

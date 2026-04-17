import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModificadoresService } from './modificadores.service';
import { ModificadoresController } from './modificadores.controller';
import { Modificadore } from './entities/modificadore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Modificadore])],
  controllers: [ModificadoresController],
  providers: [ModificadoresService],

})
export class ModificadoresModule {}

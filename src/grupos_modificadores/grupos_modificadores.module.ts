import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GruposModificadoresService } from './grupos_modificadores.service';
import { GruposModificadoresController } from './grupos_modificadores.controller';
import { GruposModificadore } from './entities/grupos_modificadore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GruposModificadore])],
  controllers: [GruposModificadoresController],
  providers: [GruposModificadoresService],

})
export class GruposModificadoresModule {}

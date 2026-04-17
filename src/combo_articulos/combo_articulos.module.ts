import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboArticulosService } from './combo_articulos.service';
import { ComboArticulosController } from './combo_articulos.controller';
import { ComboArticulo } from './entities/combo_articulo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComboArticulo])],
  controllers: [ComboArticulosController],
  providers: [ComboArticulosService],

})
export class ComboArticulosModule {}

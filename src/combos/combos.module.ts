import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombosService } from './combos.service';
import { CombosController } from './combos.controller';
import { Combo } from './entities/combo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Combo])],
  controllers: [CombosController],
  providers: [CombosService],

})
export class CombosModule {}

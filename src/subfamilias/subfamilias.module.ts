import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubfamiliasService } from './subfamilias.service';
import { SubfamiliasController } from './subfamilias.controller';
import { Subfamilia } from './entities/subfamilia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subfamilia])],
  controllers: [SubfamiliasController],
  providers: [SubfamiliasService],

})
export class SubfamiliasModule {}

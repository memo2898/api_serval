import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { Ordene } from './entities/ordene.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ordene])],
  controllers: [OrdenesController],
  providers: [OrdenesService],

})
export class OrdenesModule {}

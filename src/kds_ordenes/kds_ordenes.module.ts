import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KdsOrdenesService } from './kds_ordenes.service';
import { KdsOrdenesController } from './kds_ordenes.controller';
import { KdsOrdene } from './entities/kds_ordene.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KdsOrdene])],
  controllers: [KdsOrdenesController],
  providers: [KdsOrdenesService],

})
export class KdsOrdenesModule {}

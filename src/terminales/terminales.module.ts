import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminalesService } from './terminales.service';
import { TerminalesController } from './terminales.controller';
import { Terminale } from './entities/terminale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Terminale])],
  controllers: [TerminalesController],
  providers: [TerminalesService],

})
export class TerminalesModule {}

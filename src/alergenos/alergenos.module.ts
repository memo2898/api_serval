import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlergenosService } from './alergenos.service';
import { AlergenosController } from './alergenos.controller';
import { Alergeno } from './entities/alergeno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alergeno])],
  controllers: [AlergenosController],
  providers: [AlergenosService],

})
export class AlergenosModule {}

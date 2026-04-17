import { Module } from '@nestjs/common';

import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';

@Module({
  imports: [
  ],
  controllers: [UtilsController],
  providers: [UtilsService],
})
export class UtilsModule {}

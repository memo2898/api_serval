import {
  Controller,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UtilsService } from './utils.service';

@ApiTags('Utils')
@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Get('health')
  @ApiOperation({ summary: 'Verificar estado del servidor' })
  @ApiResponse({ status: 200, description: 'Servidor funcionando correctamente.' })
  health() {
    return this.utilsService.health();
  }

}

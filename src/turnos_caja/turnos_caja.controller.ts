import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TurnosCajaService } from './turnos_caja.service';
import { CreateTurnosCajaDto } from './dto/create-turnos_caja.dto';
import { UpdateTurnosCajaDto } from './dto/update-turnos_caja.dto';
import { TurnosCajaFiltersDto } from './dto/pagination.dto';

@ApiTags('TurnosCaja')
@Controller('turnos-caja')
export class TurnosCajaController {
  constructor(private readonly turnos_cajaService: TurnosCajaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo turnos_caja' })
  @ApiResponse({ status: 201, description: 'TurnosCaja creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createTurnosCajaDto: CreateTurnosCajaDto) {
    return this.turnos_cajaService.create(createTurnosCajaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener turnos_caja',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de turnos_caja obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: TurnosCajaFiltersDto) {
    return this.turnos_cajaService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un turnos_caja por ID' })
  @ApiResponse({ status: 200, description: 'TurnosCaja encontrado.' })
  @ApiResponse({ status: 404, description: 'TurnosCaja no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del turnos_caja' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnos_cajaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un turnos_caja' })
  @ApiResponse({ status: 200, description: 'TurnosCaja actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'TurnosCaja no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del turnos_caja' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTurnosCajaDto: UpdateTurnosCajaDto,
  ) {
    return this.turnos_cajaService.update(id, updateTurnosCajaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un turnos_caja' })
  @ApiResponse({ status: 200, description: 'TurnosCaja eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'TurnosCaja no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del turnos_caja' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turnos_cajaService.remove(id);
  }
}

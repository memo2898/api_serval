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
import { MovimientosCajaService } from './movimientos_caja.service';
import { CreateMovimientosCajaDto } from './dto/create-movimientos_caja.dto';
import { UpdateMovimientosCajaDto } from './dto/update-movimientos_caja.dto';
import { MovimientosCajaFiltersDto } from './dto/pagination.dto';

@ApiTags('MovimientosCaja')
@Controller('movimientos-caja')
export class MovimientosCajaController {
  constructor(private readonly movimientos_cajaService: MovimientosCajaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo movimientos_caja' })
  @ApiResponse({ status: 201, description: 'MovimientosCaja creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createMovimientosCajaDto: CreateMovimientosCajaDto) {
    return this.movimientos_cajaService.create(createMovimientosCajaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener movimientos_caja',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de movimientos_caja obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: MovimientosCajaFiltersDto) {
    return this.movimientos_cajaService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un movimientos_caja por ID' })
  @ApiResponse({ status: 200, description: 'MovimientosCaja encontrado.' })
  @ApiResponse({ status: 404, description: 'MovimientosCaja no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del movimientos_caja' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movimientos_cajaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un movimientos_caja' })
  @ApiResponse({ status: 200, description: 'MovimientosCaja actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'MovimientosCaja no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del movimientos_caja' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovimientosCajaDto: UpdateMovimientosCajaDto,
  ) {
    return this.movimientos_cajaService.update(id, updateMovimientosCajaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un movimientos_caja' })
  @ApiResponse({ status: 200, description: 'MovimientosCaja eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'MovimientosCaja no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del movimientos_caja' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movimientos_cajaService.remove(id);
  }
}

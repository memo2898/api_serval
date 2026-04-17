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
import { PreciosPorTarifaService } from './precios_por_tarifa.service';
import { CreatePreciosPorTarifaDto } from './dto/create-precios_por_tarifa.dto';
import { UpdatePreciosPorTarifaDto } from './dto/update-precios_por_tarifa.dto';
import { PreciosPorTarifaFiltersDto } from './dto/pagination.dto';

@ApiTags('PreciosPorTarifa')
@Controller('precios-por-tarifa')
export class PreciosPorTarifaController {
  constructor(private readonly precios_por_tarifaService: PreciosPorTarifaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo precios_por_tarifa' })
  @ApiResponse({ status: 201, description: 'PreciosPorTarifa creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createPreciosPorTarifaDto: CreatePreciosPorTarifaDto) {
    return this.precios_por_tarifaService.create(createPreciosPorTarifaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener precios_por_tarifa',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de precios_por_tarifa obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: PreciosPorTarifaFiltersDto) {
    return this.precios_por_tarifaService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un precios_por_tarifa por ID' })
  @ApiResponse({ status: 200, description: 'PreciosPorTarifa encontrado.' })
  @ApiResponse({ status: 404, description: 'PreciosPorTarifa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del precios_por_tarifa' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.precios_por_tarifaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un precios_por_tarifa' })
  @ApiResponse({ status: 200, description: 'PreciosPorTarifa actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'PreciosPorTarifa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del precios_por_tarifa' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePreciosPorTarifaDto: UpdatePreciosPorTarifaDto,
  ) {
    return this.precios_por_tarifaService.update(id, updatePreciosPorTarifaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un precios_por_tarifa' })
  @ApiResponse({ status: 200, description: 'PreciosPorTarifa eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'PreciosPorTarifa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del precios_por_tarifa' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.precios_por_tarifaService.remove(id);
  }
}

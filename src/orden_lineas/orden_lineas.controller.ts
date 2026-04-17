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
import { OrdenLineasService } from './orden_lineas.service';
import { CreateOrdenLineaDto } from './dto/create-orden_linea.dto';
import { UpdateOrdenLineaDto } from './dto/update-orden_linea.dto';
import { OrdenLineaFiltersDto } from './dto/pagination.dto';

@ApiTags('OrdenLineas')
@Controller('orden-lineas')
export class OrdenLineasController {
  constructor(private readonly orden_lineasService: OrdenLineasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo orden_linea' })
  @ApiResponse({ status: 201, description: 'OrdenLinea creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createOrdenLineaDto: CreateOrdenLineaDto) {
    return this.orden_lineasService.create(createOrdenLineaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener orden_lineas',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de orden_lineas obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: OrdenLineaFiltersDto) {
    return this.orden_lineasService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un orden_linea por ID' })
  @ApiResponse({ status: 200, description: 'OrdenLinea encontrado.' })
  @ApiResponse({ status: 404, description: 'OrdenLinea no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del orden_linea' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orden_lineasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un orden_linea' })
  @ApiResponse({ status: 200, description: 'OrdenLinea actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'OrdenLinea no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del orden_linea' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrdenLineaDto: UpdateOrdenLineaDto,
  ) {
    return this.orden_lineasService.update(id, updateOrdenLineaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un orden_linea' })
  @ApiResponse({ status: 200, description: 'OrdenLinea eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'OrdenLinea no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del orden_linea' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orden_lineasService.remove(id);
  }
}

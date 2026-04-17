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
import { OrdenLineaModificadoresService } from './orden_linea_modificadores.service';
import { CreateOrdenLineaModificadoreDto } from './dto/create-orden_linea_modificadore.dto';
import { UpdateOrdenLineaModificadoreDto } from './dto/update-orden_linea_modificadore.dto';
import { OrdenLineaModificadoreFiltersDto } from './dto/pagination.dto';

@ApiTags('OrdenLineaModificadores')
@Controller('orden-linea-modificadores')
export class OrdenLineaModificadoresController {
  constructor(private readonly orden_linea_modificadoresService: OrdenLineaModificadoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo orden_linea_modificadore' })
  @ApiResponse({ status: 201, description: 'OrdenLineaModificadore creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createOrdenLineaModificadoreDto: CreateOrdenLineaModificadoreDto) {
    return this.orden_linea_modificadoresService.create(createOrdenLineaModificadoreDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener orden_linea_modificadores',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de orden_linea_modificadores obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: OrdenLineaModificadoreFiltersDto) {
    return this.orden_linea_modificadoresService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un orden_linea_modificadore por ID' })
  @ApiResponse({ status: 200, description: 'OrdenLineaModificadore encontrado.' })
  @ApiResponse({ status: 404, description: 'OrdenLineaModificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del orden_linea_modificadore' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orden_linea_modificadoresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un orden_linea_modificadore' })
  @ApiResponse({ status: 200, description: 'OrdenLineaModificadore actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'OrdenLineaModificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del orden_linea_modificadore' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrdenLineaModificadoreDto: UpdateOrdenLineaModificadoreDto,
  ) {
    return this.orden_linea_modificadoresService.update(id, updateOrdenLineaModificadoreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un orden_linea_modificadore' })
  @ApiResponse({ status: 200, description: 'OrdenLineaModificadore eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'OrdenLineaModificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del orden_linea_modificadore' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orden_linea_modificadoresService.remove(id);
  }
}

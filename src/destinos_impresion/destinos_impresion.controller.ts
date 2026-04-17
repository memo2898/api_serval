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
import { DestinosImpresionService } from './destinos_impresion.service';
import { CreateDestinosImpresionDto } from './dto/create-destinos_impresion.dto';
import { UpdateDestinosImpresionDto } from './dto/update-destinos_impresion.dto';
import { DestinosImpresionFiltersDto } from './dto/pagination.dto';

@ApiTags('DestinosImpresion')
@Controller('destinos-impresion')
export class DestinosImpresionController {
  constructor(private readonly destinos_impresionService: DestinosImpresionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo destinos_impresion' })
  @ApiResponse({ status: 201, description: 'DestinosImpresion creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createDestinosImpresionDto: CreateDestinosImpresionDto) {
    return this.destinos_impresionService.create(createDestinosImpresionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener destinos_impresion',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de destinos_impresion obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: DestinosImpresionFiltersDto) {
    return this.destinos_impresionService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un destinos_impresion por ID' })
  @ApiResponse({ status: 200, description: 'DestinosImpresion encontrado.' })
  @ApiResponse({ status: 404, description: 'DestinosImpresion no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del destinos_impresion' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.destinos_impresionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un destinos_impresion' })
  @ApiResponse({ status: 200, description: 'DestinosImpresion actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'DestinosImpresion no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del destinos_impresion' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDestinosImpresionDto: UpdateDestinosImpresionDto,
  ) {
    return this.destinos_impresionService.update(id, updateDestinosImpresionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un destinos_impresion' })
  @ApiResponse({ status: 200, description: 'DestinosImpresion eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'DestinosImpresion no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del destinos_impresion' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.destinos_impresionService.remove(id);
  }
}

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
import { ComboArticulosService } from './combo_articulos.service';
import { CreateComboArticuloDto } from './dto/create-combo_articulo.dto';
import { UpdateComboArticuloDto } from './dto/update-combo_articulo.dto';
import { ComboArticuloFiltersDto } from './dto/pagination.dto';

@ApiTags('ComboArticulos')
@Controller('combo-articulos')
export class ComboArticulosController {
  constructor(private readonly combo_articulosService: ComboArticulosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo combo_articulo' })
  @ApiResponse({ status: 201, description: 'ComboArticulo creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createComboArticuloDto: CreateComboArticuloDto) {
    return this.combo_articulosService.create(createComboArticuloDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener combo_articulos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de combo_articulos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ComboArticuloFiltersDto) {
    return this.combo_articulosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un combo_articulo por ID' })
  @ApiResponse({ status: 200, description: 'ComboArticulo encontrado.' })
  @ApiResponse({ status: 404, description: 'ComboArticulo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del combo_articulo' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.combo_articulosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un combo_articulo' })
  @ApiResponse({ status: 200, description: 'ComboArticulo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'ComboArticulo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del combo_articulo' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComboArticuloDto: UpdateComboArticuloDto,
  ) {
    return this.combo_articulosService.update(id, updateComboArticuloDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un combo_articulo' })
  @ApiResponse({ status: 200, description: 'ComboArticulo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'ComboArticulo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del combo_articulo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.combo_articulosService.remove(id);
  }
}

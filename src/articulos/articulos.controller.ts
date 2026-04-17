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
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { ArticuloFiltersDto } from './dto/pagination.dto';

@ApiTags('Articulos')
@Controller('articulos')
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo articulo' })
  @ApiResponse({ status: 201, description: 'Articulo creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createArticuloDto: CreateArticuloDto) {
    return this.articulosService.create(createArticuloDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener articulos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de articulos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ArticuloFiltersDto) {
    return this.articulosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un articulo por ID' })
  @ApiResponse({ status: 200, description: 'Articulo encontrado.' })
  @ApiResponse({ status: 404, description: 'Articulo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articulosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un articulo' })
  @ApiResponse({ status: 200, description: 'Articulo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Articulo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticuloDto: UpdateArticuloDto,
  ) {
    return this.articulosService.update(id, updateArticuloDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un articulo' })
  @ApiResponse({ status: 200, description: 'Articulo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Articulo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articulosService.remove(id);
  }
}

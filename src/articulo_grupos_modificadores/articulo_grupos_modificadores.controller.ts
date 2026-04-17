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
import { ArticuloGruposModificadoresService } from './articulo_grupos_modificadores.service';
import { CreateArticuloGruposModificadoreDto } from './dto/create-articulo_grupos_modificadore.dto';
import { UpdateArticuloGruposModificadoreDto } from './dto/update-articulo_grupos_modificadore.dto';
import { ArticuloGruposModificadoreFiltersDto } from './dto/pagination.dto';

@ApiTags('ArticuloGruposModificadores')
@Controller('articulo-grupos-modificadores')
export class ArticuloGruposModificadoresController {
  constructor(private readonly articulo_grupos_modificadoresService: ArticuloGruposModificadoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo articulo_grupos_modificadore' })
  @ApiResponse({ status: 201, description: 'ArticuloGruposModificadore creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createArticuloGruposModificadoreDto: CreateArticuloGruposModificadoreDto) {
    return this.articulo_grupos_modificadoresService.create(createArticuloGruposModificadoreDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener articulo_grupos_modificadores',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de articulo_grupos_modificadores obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ArticuloGruposModificadoreFiltersDto) {
    return this.articulo_grupos_modificadoresService.findAll(filters);
  }

  @Get(':articuloId/:grupoId')
  @ApiOperation({ summary: 'Obtener un articulo_grupos_modificadore por ID' })
  @ApiResponse({ status: 200, description: 'ArticuloGruposModificadore encontrado.' })
  @ApiResponse({ status: 404, description: 'ArticuloGruposModificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo_grupos_modificadore' })
  findOne(@Param('articuloId', ParseIntPipe) articuloId: number, @Param('grupoId', ParseIntPipe) grupoId: number) {
    return this.articulo_grupos_modificadoresService.findOne(articuloId, grupoId);
  }

  @Patch(':articuloId/:grupoId')
  @ApiOperation({ summary: 'Actualizar un articulo_grupos_modificadore' })
  @ApiResponse({ status: 200, description: 'ArticuloGruposModificadore actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'ArticuloGruposModificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo_grupos_modificadore' })
  update(
    @Param('articuloId', ParseIntPipe) articuloId: number, @Param('grupoId', ParseIntPipe) grupoId: number,
    @Body() updateArticuloGruposModificadoreDto: UpdateArticuloGruposModificadoreDto,
  ) {
    return this.articulo_grupos_modificadoresService.update(articuloId, grupoId, updateArticuloGruposModificadoreDto);
  }

  @Delete(':articuloId/:grupoId')
  @ApiOperation({ summary: 'Eliminar un articulo_grupos_modificadore' })
  @ApiResponse({ status: 200, description: 'ArticuloGruposModificadore eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'ArticuloGruposModificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo_grupos_modificadore' })
  remove(@Param('articuloId', ParseIntPipe) articuloId: number, @Param('grupoId', ParseIntPipe) grupoId: number) {
    return this.articulo_grupos_modificadoresService.remove(articuloId, grupoId);
  }
}

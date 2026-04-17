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
import { GruposModificadoresService } from './grupos_modificadores.service';
import { CreateGruposModificadoreDto } from './dto/create-grupos_modificadore.dto';
import { UpdateGruposModificadoreDto } from './dto/update-grupos_modificadore.dto';
import { GruposModificadoreFiltersDto } from './dto/pagination.dto';

@ApiTags('GruposModificadores')
@Controller('grupos-modificadores')
export class GruposModificadoresController {
  constructor(private readonly grupos_modificadoresService: GruposModificadoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo grupos_modificadore' })
  @ApiResponse({ status: 201, description: 'GruposModificadore creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createGruposModificadoreDto: CreateGruposModificadoreDto) {
    return this.grupos_modificadoresService.create(createGruposModificadoreDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener grupos_modificadores',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de grupos_modificadores obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: GruposModificadoreFiltersDto) {
    return this.grupos_modificadoresService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un grupos_modificadore por ID' })
  @ApiResponse({ status: 200, description: 'GruposModificadore encontrado.' })
  @ApiResponse({ status: 404, description: 'GruposModificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del grupos_modificadore' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.grupos_modificadoresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un grupos_modificadore' })
  @ApiResponse({ status: 200, description: 'GruposModificadore actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'GruposModificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del grupos_modificadore' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGruposModificadoreDto: UpdateGruposModificadoreDto,
  ) {
    return this.grupos_modificadoresService.update(id, updateGruposModificadoreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un grupos_modificadore' })
  @ApiResponse({ status: 200, description: 'GruposModificadore eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'GruposModificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del grupos_modificadore' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.grupos_modificadoresService.remove(id);
  }
}

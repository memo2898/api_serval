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
import { FamiliasService } from './familias.service';
import { CreateFamiliaDto } from './dto/create-familia.dto';
import { UpdateFamiliaDto } from './dto/update-familia.dto';
import { FamiliaFiltersDto } from './dto/pagination.dto';

@ApiTags('Familias')
@Controller('familias')
export class FamiliasController {
  constructor(private readonly familiasService: FamiliasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo familia' })
  @ApiResponse({ status: 201, description: 'Familia creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createFamiliaDto: CreateFamiliaDto) {
    return this.familiasService.create(createFamiliaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener familias',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de familias obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: FamiliaFiltersDto) {
    return this.familiasService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un familia por ID' })
  @ApiResponse({ status: 200, description: 'Familia encontrado.' })
  @ApiResponse({ status: 404, description: 'Familia no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del familia' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.familiasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un familia' })
  @ApiResponse({ status: 200, description: 'Familia actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Familia no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del familia' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFamiliaDto: UpdateFamiliaDto,
  ) {
    return this.familiasService.update(id, updateFamiliaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un familia' })
  @ApiResponse({ status: 200, description: 'Familia eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Familia no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del familia' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.familiasService.remove(id);
  }
}

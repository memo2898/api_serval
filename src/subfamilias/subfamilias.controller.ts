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
import { SubfamiliasService } from './subfamilias.service';
import { CreateSubfamiliaDto } from './dto/create-subfamilia.dto';
import { UpdateSubfamiliaDto } from './dto/update-subfamilia.dto';
import { SubfamiliaFiltersDto } from './dto/pagination.dto';

@ApiTags('Subfamilias')
@Controller('subfamilias')
export class SubfamiliasController {
  constructor(private readonly subfamiliasService: SubfamiliasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo subfamilia' })
  @ApiResponse({ status: 201, description: 'Subfamilia creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createSubfamiliaDto: CreateSubfamiliaDto) {
    return this.subfamiliasService.create(createSubfamiliaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener subfamilias',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de subfamilias obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: SubfamiliaFiltersDto) {
    return this.subfamiliasService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un subfamilia por ID' })
  @ApiResponse({ status: 200, description: 'Subfamilia encontrado.' })
  @ApiResponse({ status: 404, description: 'Subfamilia no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del subfamilia' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subfamiliasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un subfamilia' })
  @ApiResponse({ status: 200, description: 'Subfamilia actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Subfamilia no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del subfamilia' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubfamiliaDto: UpdateSubfamiliaDto,
  ) {
    return this.subfamiliasService.update(id, updateSubfamiliaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un subfamilia' })
  @ApiResponse({ status: 200, description: 'Subfamilia eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Subfamilia no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del subfamilia' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subfamiliasService.remove(id);
  }
}

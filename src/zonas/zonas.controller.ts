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
import { ZonasService } from './zonas.service';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { ZonaFiltersDto } from './dto/pagination.dto';

@ApiTags('Zonas')
@Controller('zonas')
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo zona' })
  @ApiResponse({ status: 201, description: 'Zona creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createZonaDto: CreateZonaDto) {
    return this.zonasService.create(createZonaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener zonas',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de zonas obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ZonaFiltersDto) {
    return this.zonasService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un zona por ID' })
  @ApiResponse({ status: 200, description: 'Zona encontrado.' })
  @ApiResponse({ status: 404, description: 'Zona no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del zona' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zonasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un zona' })
  @ApiResponse({ status: 200, description: 'Zona actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Zona no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del zona' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZonaDto: UpdateZonaDto,
  ) {
    return this.zonasService.update(id, updateZonaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un zona' })
  @ApiResponse({ status: 200, description: 'Zona eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Zona no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del zona' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.zonasService.remove(id);
  }
}

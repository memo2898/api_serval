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
import { OrdenesService } from './ordenes.service';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { OrdeneFiltersDto } from './dto/pagination.dto';

@ApiTags('Ordenes')
@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo ordene' })
  @ApiResponse({ status: 201, description: 'Ordene creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createOrdeneDto: CreateOrdeneDto) {
    return this.ordenesService.create(createOrdeneDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener ordenes',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de ordenes obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: OrdeneFiltersDto) {
    return this.ordenesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ordene por ID' })
  @ApiResponse({ status: 200, description: 'Ordene encontrado.' })
  @ApiResponse({ status: 404, description: 'Ordene no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del ordene' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ordene' })
  @ApiResponse({ status: 200, description: 'Ordene actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ordene no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del ordene' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrdeneDto: UpdateOrdeneDto,
  ) {
    return this.ordenesService.update(id, updateOrdeneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ordene' })
  @ApiResponse({ status: 200, description: 'Ordene eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ordene no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del ordene' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordenesService.remove(id);
  }
}

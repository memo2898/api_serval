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
import { KdsOrdenesService } from './kds_ordenes.service';
import { CreateKdsOrdeneDto } from './dto/create-kds_ordene.dto';
import { UpdateKdsOrdeneDto } from './dto/update-kds_ordene.dto';
import { KdsOrdeneFiltersDto } from './dto/pagination.dto';

@ApiTags('KdsOrdenes')
@Controller('kds-ordenes')
export class KdsOrdenesController {
  constructor(private readonly kds_ordenesService: KdsOrdenesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo kds_ordene' })
  @ApiResponse({ status: 201, description: 'KdsOrdene creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createKdsOrdeneDto: CreateKdsOrdeneDto) {
    return this.kds_ordenesService.create(createKdsOrdeneDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener kds_ordenes',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de kds_ordenes obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: KdsOrdeneFiltersDto) {
    return this.kds_ordenesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un kds_ordene por ID' })
  @ApiResponse({ status: 200, description: 'KdsOrdene encontrado.' })
  @ApiResponse({ status: 404, description: 'KdsOrdene no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del kds_ordene' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.kds_ordenesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un kds_ordene' })
  @ApiResponse({ status: 200, description: 'KdsOrdene actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'KdsOrdene no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del kds_ordene' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKdsOrdeneDto: UpdateKdsOrdeneDto,
  ) {
    return this.kds_ordenesService.update(id, updateKdsOrdeneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un kds_ordene' })
  @ApiResponse({ status: 200, description: 'KdsOrdene eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'KdsOrdene no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del kds_ordene' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.kds_ordenesService.remove(id);
  }
}

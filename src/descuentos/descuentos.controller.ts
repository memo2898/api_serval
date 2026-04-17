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
import { DescuentosService } from './descuentos.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { DescuentoFiltersDto } from './dto/pagination.dto';

@ApiTags('Descuentos')
@Controller('descuentos')
export class DescuentosController {
  constructor(private readonly descuentosService: DescuentosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo descuento' })
  @ApiResponse({ status: 201, description: 'Descuento creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createDescuentoDto: CreateDescuentoDto) {
    return this.descuentosService.create(createDescuentoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener descuentos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de descuentos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: DescuentoFiltersDto) {
    return this.descuentosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un descuento por ID' })
  @ApiResponse({ status: 200, description: 'Descuento encontrado.' })
  @ApiResponse({ status: 404, description: 'Descuento no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del descuento' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.descuentosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un descuento' })
  @ApiResponse({ status: 200, description: 'Descuento actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Descuento no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del descuento' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDescuentoDto: UpdateDescuentoDto,
  ) {
    return this.descuentosService.update(id, updateDescuentoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un descuento' })
  @ApiResponse({ status: 200, description: 'Descuento eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Descuento no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del descuento' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.descuentosService.remove(id);
  }
}

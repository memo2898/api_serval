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
import { MonedasService } from './monedas.service';
import { CreateMonedaDto } from './dto/create-moneda.dto';
import { UpdateMonedaDto } from './dto/update-moneda.dto';
import { MonedaFiltersDto } from './dto/pagination.dto';

@ApiTags('Monedas')
@Controller('monedas')
export class MonedasController {
  constructor(private readonly monedasService: MonedasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo moneda' })
  @ApiResponse({ status: 201, description: 'Moneda creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createMonedaDto: CreateMonedaDto) {
    return this.monedasService.create(createMonedaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener monedas',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de monedas obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: MonedaFiltersDto) {
    return this.monedasService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un moneda por ID' })
  @ApiResponse({ status: 200, description: 'Moneda encontrado.' })
  @ApiResponse({ status: 404, description: 'Moneda no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del moneda' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.monedasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un moneda' })
  @ApiResponse({ status: 200, description: 'Moneda actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Moneda no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del moneda' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMonedaDto: UpdateMonedaDto,
  ) {
    return this.monedasService.update(id, updateMonedaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un moneda' })
  @ApiResponse({ status: 200, description: 'Moneda eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Moneda no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del moneda' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.monedasService.remove(id);
  }
}

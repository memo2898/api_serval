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
import { MovimientosStockService } from './movimientos_stock.service';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
import { UpdateMovimientosStockDto } from './dto/update-movimientos_stock.dto';
import { MovimientosStockFiltersDto } from './dto/pagination.dto';

@ApiTags('MovimientosStock')
@Controller('movimientos-stock')
export class MovimientosStockController {
  constructor(private readonly movimientos_stockService: MovimientosStockService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo movimientos_stock' })
  @ApiResponse({ status: 201, description: 'MovimientosStock creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createMovimientosStockDto: CreateMovimientosStockDto) {
    return this.movimientos_stockService.create(createMovimientosStockDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener movimientos_stock',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de movimientos_stock obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: MovimientosStockFiltersDto) {
    return this.movimientos_stockService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un movimientos_stock por ID' })
  @ApiResponse({ status: 200, description: 'MovimientosStock encontrado.' })
  @ApiResponse({ status: 404, description: 'MovimientosStock no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del movimientos_stock' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movimientos_stockService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un movimientos_stock' })
  @ApiResponse({ status: 200, description: 'MovimientosStock actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'MovimientosStock no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del movimientos_stock' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovimientosStockDto: UpdateMovimientosStockDto,
  ) {
    return this.movimientos_stockService.update(id, updateMovimientosStockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un movimientos_stock' })
  @ApiResponse({ status: 200, description: 'MovimientosStock eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'MovimientosStock no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del movimientos_stock' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movimientos_stockService.remove(id);
  }
}

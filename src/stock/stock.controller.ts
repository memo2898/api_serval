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
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockFiltersDto } from './dto/pagination.dto';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo stock' })
  @ApiResponse({ status: 201, description: 'Stock creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener stock',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de stock obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: StockFiltersDto) {
    return this.stockService.findAll(filters);
  }

  @Get(':articuloId/:sucursalId')
  @ApiOperation({ summary: 'Obtener un stock por ID' })
  @ApiResponse({ status: 200, description: 'Stock encontrado.' })
  @ApiResponse({ status: 404, description: 'Stock no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del stock' })
  findOne(@Param('articuloId', ParseIntPipe) articuloId: number, @Param('sucursalId', ParseIntPipe) sucursalId: number) {
    return this.stockService.findOne(articuloId, sucursalId);
  }

  @Patch(':articuloId/:sucursalId')
  @ApiOperation({ summary: 'Actualizar un stock' })
  @ApiResponse({ status: 200, description: 'Stock actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Stock no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del stock' })
  update(
    @Param('articuloId', ParseIntPipe) articuloId: number, @Param('sucursalId', ParseIntPipe) sucursalId: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.update(articuloId, sucursalId, updateStockDto);
  }

  @Delete(':articuloId/:sucursalId')
  @ApiOperation({ summary: 'Eliminar un stock' })
  @ApiResponse({ status: 200, description: 'Stock eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Stock no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del stock' })
  remove(@Param('articuloId', ParseIntPipe) articuloId: number, @Param('sucursalId', ParseIntPipe) sucursalId: number) {
    return this.stockService.remove(articuloId, sucursalId);
  }
}

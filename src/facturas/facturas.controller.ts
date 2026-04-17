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
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { FacturaFiltersDto } from './dto/pagination.dto';

@ApiTags('Facturas')
@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo factura' })
  @ApiResponse({ status: 201, description: 'Factura creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturasService.create(createFacturaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener facturas',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de facturas obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: FacturaFiltersDto) {
    return this.facturasService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un factura por ID' })
  @ApiResponse({ status: 200, description: 'Factura encontrado.' })
  @ApiResponse({ status: 404, description: 'Factura no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del factura' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un factura' })
  @ApiResponse({ status: 200, description: 'Factura actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Factura no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del factura' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacturaDto: UpdateFacturaDto,
  ) {
    return this.facturasService.update(id, updateFacturaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un factura' })
  @ApiResponse({ status: 200, description: 'Factura eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Factura no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del factura' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.remove(id);
  }
}

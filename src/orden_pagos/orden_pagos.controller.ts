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
import { OrdenPagosService } from './orden_pagos.service';
import { CreateOrdenPagoDto } from './dto/create-orden_pago.dto';
import { UpdateOrdenPagoDto } from './dto/update-orden_pago.dto';
import { OrdenPagoFiltersDto } from './dto/pagination.dto';

@ApiTags('OrdenPagos')
@Controller('orden-pagos')
export class OrdenPagosController {
  constructor(private readonly orden_pagosService: OrdenPagosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo orden_pago' })
  @ApiResponse({ status: 201, description: 'OrdenPago creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createOrdenPagoDto: CreateOrdenPagoDto) {
    return this.orden_pagosService.create(createOrdenPagoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener orden_pagos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de orden_pagos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: OrdenPagoFiltersDto) {
    return this.orden_pagosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un orden_pago por ID' })
  @ApiResponse({ status: 200, description: 'OrdenPago encontrado.' })
  @ApiResponse({ status: 404, description: 'OrdenPago no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del orden_pago' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orden_pagosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un orden_pago' })
  @ApiResponse({ status: 200, description: 'OrdenPago actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'OrdenPago no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del orden_pago' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrdenPagoDto: UpdateOrdenPagoDto,
  ) {
    return this.orden_pagosService.update(id, updateOrdenPagoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un orden_pago' })
  @ApiResponse({ status: 200, description: 'OrdenPago eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'OrdenPago no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del orden_pago' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orden_pagosService.remove(id);
  }
}

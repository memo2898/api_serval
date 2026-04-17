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
import { FormasPagoService } from './formas_pago.service';
import { CreateFormasPagoDto } from './dto/create-formas_pago.dto';
import { UpdateFormasPagoDto } from './dto/update-formas_pago.dto';
import { FormasPagoFiltersDto } from './dto/pagination.dto';

@ApiTags('FormasPago')
@Controller('formas-pago')
export class FormasPagoController {
  constructor(private readonly formas_pagoService: FormasPagoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo formas_pago' })
  @ApiResponse({ status: 201, description: 'FormasPago creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createFormasPagoDto: CreateFormasPagoDto) {
    return this.formas_pagoService.create(createFormasPagoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener formas_pago',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de formas_pago obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: FormasPagoFiltersDto) {
    return this.formas_pagoService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un formas_pago por ID' })
  @ApiResponse({ status: 200, description: 'FormasPago encontrado.' })
  @ApiResponse({ status: 404, description: 'FormasPago no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del formas_pago' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.formas_pagoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un formas_pago' })
  @ApiResponse({ status: 200, description: 'FormasPago actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'FormasPago no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del formas_pago' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFormasPagoDto: UpdateFormasPagoDto,
  ) {
    return this.formas_pagoService.update(id, updateFormasPagoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un formas_pago' })
  @ApiResponse({ status: 200, description: 'FormasPago eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'FormasPago no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del formas_pago' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.formas_pagoService.remove(id);
  }
}

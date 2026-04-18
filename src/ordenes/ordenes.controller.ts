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
import { IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrdenesService, PagoInput } from './ordenes.service';
import { OrdenLineasService } from '../orden_lineas/orden_lineas.service';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { OrdeneFiltersDto } from './dto/pagination.dto';

class PagoInputDto implements PagoInput {
  @IsNumber() forma_pago_id: number;
  @IsNumber() monto: number;
  @IsOptional() @IsNumber() cuenta_num?: number;
  @IsOptional() @IsString() referencia?: string;
}

class CobrarOrdenDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PagoInputDto)
  pagos: PagoInputDto[];
}

@ApiTags('Ordenes')
@Controller('ordenes')
export class OrdenesController {
  constructor(
    private readonly ordenesService: OrdenesService,
    private readonly ordenLineasService: OrdenLineasService,
  ) {}

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

  @Post(':id/cobrar')
  @ApiOperation({ summary: 'Registrar cobro de una orden' })
  @ApiResponse({ status: 201, description: 'Cobro registrado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la orden' })
  cobrar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CobrarOrdenDto,
  ) {
    return this.ordenesService.cobrar(id, dto.pagos);
  }

  @Get(':id/lineas')
  @ApiOperation({
    summary: 'Obtener líneas de una orden',
    description: 'Retorna todas las líneas de la orden con su artículo y modificadores aplicados.',
  })
  @ApiResponse({ status: 200, description: 'Líneas obtenidas exitosamente.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la orden' })
  getLineas(@Param('id', ParseIntPipe) id: number) {
    return this.ordenLineasService.findByOrden(id);
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

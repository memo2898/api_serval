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
import { SucursalImpuestosService } from './sucursal_impuestos.service';
import { CreateSucursalImpuestoDto } from './dto/create-sucursal_impuesto.dto';
import { UpdateSucursalImpuestoDto } from './dto/update-sucursal_impuesto.dto';
import { SucursalImpuestoFiltersDto } from './dto/pagination.dto';

@ApiTags('SucursalImpuestos')
@Controller('sucursal-impuestos')
export class SucursalImpuestosController {
  constructor(private readonly sucursal_impuestosService: SucursalImpuestosService) {}

  @Post()
  @ApiOperation({ summary: 'Asignar un impuesto a una sucursal' })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createSucursalImpuestoDto: CreateSucursalImpuestoDto) {
    return this.sucursal_impuestosService.create(createSucursalImpuestoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener impuestos de sucursales',
    description:
      'Soporta paginación y filtros. Filtra por sucursal_id para obtener los impuestos de una sucursal.',
  })
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente.' })
  @ApiQuery({ name: 'sucursal_id', required: false, type: Number, description: 'Filtrar por sucursal' })
  @ApiQuery({ name: 'impuesto_id', required: false, type: Number, description: 'Filtrar por impuesto' })
  @ApiQuery({ name: 'obligatorio', required: false, type: Boolean, description: 'Filtrar por obligatorio' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: orden_aplicacion:ASC)' })
  findAll(@Query() filters: SucursalImpuestoFiltersDto) {
    return this.sucursal_impuestosService.findAll(filters);
  }

  @Get(':sucursalId/:impuestoId')
  @ApiOperation({ summary: 'Obtener un impuesto de una sucursal por PK compuesta' })
  @ApiResponse({ status: 200, description: 'Registro encontrado.' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado.' })
  @ApiParam({ name: 'sucursalId', type: 'number' })
  @ApiParam({ name: 'impuestoId', type: 'number' })
  findOne(
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
    @Param('impuestoId', ParseIntPipe) impuestoId: number,
  ) {
    return this.sucursal_impuestosService.findOne(sucursalId, impuestoId);
  }

  @Patch(':sucursalId/:impuestoId')
  @ApiOperation({ summary: 'Actualizar un impuesto de una sucursal' })
  @ApiResponse({ status: 200, description: 'Registro actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado.' })
  @ApiParam({ name: 'sucursalId', type: 'number' })
  @ApiParam({ name: 'impuestoId', type: 'number' })
  update(
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
    @Param('impuestoId', ParseIntPipe) impuestoId: number,
    @Body() updateSucursalImpuestoDto: UpdateSucursalImpuestoDto,
  ) {
    return this.sucursal_impuestosService.update(sucursalId, impuestoId, updateSucursalImpuestoDto);
  }

  @Delete(':sucursalId/:impuestoId')
  @ApiOperation({ summary: 'Eliminar un impuesto de una sucursal' })
  @ApiResponse({ status: 200, description: 'Registro eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado.' })
  @ApiParam({ name: 'sucursalId', type: 'number' })
  @ApiParam({ name: 'impuestoId', type: 'number' })
  remove(
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
    @Param('impuestoId', ParseIntPipe) impuestoId: number,
  ) {
    return this.sucursal_impuestosService.remove(sucursalId, impuestoId);
  }
}

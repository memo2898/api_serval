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
import { ConfiguracionSucursalService } from './configuracion_sucursal.service';
import { CreateConfiguracionSucursalDto } from './dto/create-configuracion_sucursal.dto';
import { UpdateConfiguracionSucursalDto } from './dto/update-configuracion_sucursal.dto';
import { ConfiguracionSucursalFiltersDto } from './dto/pagination.dto';

@ApiTags('ConfiguracionSucursal')
@Controller('configuracion-sucursal')
export class ConfiguracionSucursalController {
  constructor(private readonly configuracion_sucursalService: ConfiguracionSucursalService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo configuracion_sucursal' })
  @ApiResponse({ status: 201, description: 'ConfiguracionSucursal creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createConfiguracionSucursalDto: CreateConfiguracionSucursalDto) {
    return this.configuracion_sucursalService.create(createConfiguracionSucursalDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener configuracion_sucursal',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de configuracion_sucursal obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ConfiguracionSucursalFiltersDto) {
    return this.configuracion_sucursalService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un configuracion_sucursal por ID' })
  @ApiResponse({ status: 200, description: 'ConfiguracionSucursal encontrado.' })
  @ApiResponse({ status: 404, description: 'ConfiguracionSucursal no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del configuracion_sucursal' })
  findOne(@Param('id', ParseIntPipe) sucursalId: number) {
    return this.configuracion_sucursalService.findOne(sucursalId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un configuracion_sucursal' })
  @ApiResponse({ status: 200, description: 'ConfiguracionSucursal actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'ConfiguracionSucursal no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del configuracion_sucursal' })
  update(
    @Param('id', ParseIntPipe) sucursalId: number,
    @Body() updateConfiguracionSucursalDto: UpdateConfiguracionSucursalDto,
  ) {
    return this.configuracion_sucursalService.update(sucursalId, updateConfiguracionSucursalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un configuracion_sucursal' })
  @ApiResponse({ status: 200, description: 'ConfiguracionSucursal eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'ConfiguracionSucursal no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del configuracion_sucursal' })
  remove(@Param('id', ParseIntPipe) sucursalId: number) {
    return this.configuracion_sucursalService.remove(sucursalId);
  }
}

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
import { SucursalesService } from './sucursales.service';
import { CreateSucursaleDto } from './dto/create-sucursale.dto';
import { UpdateSucursaleDto } from './dto/update-sucursale.dto';
import { SucursaleFiltersDto } from './dto/pagination.dto';

@ApiTags('Sucursales')
@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo sucursale' })
  @ApiResponse({ status: 201, description: 'Sucursale creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createSucursaleDto: CreateSucursaleDto) {
    return this.sucursalesService.create(createSucursaleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener sucursales',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de sucursales obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: SucursaleFiltersDto) {
    return this.sucursalesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un sucursale por ID' })
  @ApiResponse({ status: 200, description: 'Sucursale encontrado.' })
  @ApiResponse({ status: 404, description: 'Sucursale no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del sucursale' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un sucursale' })
  @ApiResponse({ status: 200, description: 'Sucursale actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Sucursale no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del sucursale' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSucursaleDto: UpdateSucursaleDto,
  ) {
    return this.sucursalesService.update(id, updateSucursaleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un sucursale' })
  @ApiResponse({ status: 200, description: 'Sucursale eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Sucursale no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del sucursale' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalesService.remove(id);
  }
}

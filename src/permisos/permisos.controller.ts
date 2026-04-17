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
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { PermisoFiltersDto } from './dto/pagination.dto';

@ApiTags('Permisos')
@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo permiso' })
  @ApiResponse({ status: 201, description: 'Permiso creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createPermisoDto: CreatePermisoDto) {
    return this.permisosService.create(createPermisoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener permisos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de permisos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: PermisoFiltersDto) {
    return this.permisosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un permiso por ID' })
  @ApiResponse({ status: 200, description: 'Permiso encontrado.' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del permiso' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permisosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un permiso' })
  @ApiResponse({ status: 200, description: 'Permiso actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del permiso' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermisoDto: UpdatePermisoDto,
  ) {
    return this.permisosService.update(id, updatePermisoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un permiso' })
  @ApiResponse({ status: 200, description: 'Permiso eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del permiso' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permisosService.remove(id);
  }
}

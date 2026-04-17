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
import { RolPermisoService } from './rol_permiso.service';
import { CreateRolPermisoDto } from './dto/create-rol_permiso.dto';
import { UpdateRolPermisoDto } from './dto/update-rol_permiso.dto';
import { RolPermisoFiltersDto } from './dto/pagination.dto';

@ApiTags('RolPermiso')
@Controller('rol-permiso')
export class RolPermisoController {
  constructor(private readonly rol_permisoService: RolPermisoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol_permiso' })
  @ApiResponse({ status: 201, description: 'RolPermiso creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createRolPermisoDto: CreateRolPermisoDto) {
    return this.rol_permisoService.create(createRolPermisoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener rol_permiso',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de rol_permiso obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: RolPermisoFiltersDto) {
    return this.rol_permisoService.findAll(filters);
  }

  @Get(':rolId/:permisoId')
  @ApiOperation({ summary: 'Obtener un rol_permiso por ID' })
  @ApiResponse({ status: 200, description: 'RolPermiso encontrado.' })
  @ApiResponse({ status: 404, description: 'RolPermiso no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del rol_permiso' })
  findOne(@Param('rolId', ParseIntPipe) rolId: number, @Param('permisoId', ParseIntPipe) permisoId: number) {
    return this.rol_permisoService.findOne(rolId, permisoId);
  }

  @Patch(':rolId/:permisoId')
  @ApiOperation({ summary: 'Actualizar un rol_permiso' })
  @ApiResponse({ status: 200, description: 'RolPermiso actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'RolPermiso no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del rol_permiso' })
  update(
    @Param('rolId', ParseIntPipe) rolId: number, @Param('permisoId', ParseIntPipe) permisoId: number,
    @Body() updateRolPermisoDto: UpdateRolPermisoDto,
  ) {
    return this.rol_permisoService.update(rolId, permisoId, updateRolPermisoDto);
  }

  @Delete(':rolId/:permisoId')
  @ApiOperation({ summary: 'Eliminar un rol_permiso' })
  @ApiResponse({ status: 200, description: 'RolPermiso eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'RolPermiso no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del rol_permiso' })
  remove(@Param('rolId', ParseIntPipe) rolId: number, @Param('permisoId', ParseIntPipe) permisoId: number) {
    return this.rol_permisoService.remove(rolId, permisoId);
  }
}

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
import { UsuarioRolService } from './usuario_rol.service';
import { CreateUsuarioRolDto } from './dto/create-usuario_rol.dto';
import { UpdateUsuarioRolDto } from './dto/update-usuario_rol.dto';
import { UsuarioRolFiltersDto } from './dto/pagination.dto';

@ApiTags('UsuarioRol')
@Controller('usuario-rol')
export class UsuarioRolController {
  constructor(private readonly usuario_rolService: UsuarioRolService) {}

  @Post()
  @ApiOperation({ summary: 'Asignar un rol a un usuario' })
  @ApiResponse({ status: 201, description: 'UsuarioRol creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createUsuarioRolDto: CreateUsuarioRolDto) {
    return this.usuario_rolService.create(createUsuarioRolDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener usuario_rol',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuario_rol obtenida exitosamente.' })
  @ApiQuery({ name: 'page',     required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit',    required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',     required: false, type: String, description: 'Campo:dirección (ej: usuario_id:ASC)' })
  @ApiQuery({ name: 'usuario_id', required: false, type: Number })
  @ApiQuery({ name: 'rol_id',     required: false, type: Number })
  findAll(@Query() filters: UsuarioRolFiltersDto) {
    return this.usuario_rolService.findAll(filters);
  }

  @Get(':usuarioId/:rolId')
  @ApiOperation({ summary: 'Obtener un usuario_rol por PK compuesta' })
  @ApiResponse({ status: 200, description: 'UsuarioRol encontrado.' })
  @ApiResponse({ status: 404, description: 'UsuarioRol no encontrado.' })
  @ApiParam({ name: 'usuarioId', type: 'number' })
  @ApiParam({ name: 'rolId',     type: 'number' })
  findOne(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('rolId',     ParseIntPipe) rolId: number,
  ) {
    return this.usuario_rolService.findOne(usuarioId, rolId);
  }

  @Patch(':usuarioId/:rolId')
  @ApiOperation({ summary: 'Actualizar un usuario_rol' })
  @ApiResponse({ status: 200, description: 'UsuarioRol actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'UsuarioRol no encontrado.' })
  @ApiParam({ name: 'usuarioId', type: 'number' })
  @ApiParam({ name: 'rolId',     type: 'number' })
  update(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('rolId',     ParseIntPipe) rolId: number,
    @Body() updateUsuarioRolDto: UpdateUsuarioRolDto,
  ) {
    return this.usuario_rolService.update(usuarioId, rolId, updateUsuarioRolDto);
  }

  @Delete(':usuarioId/:rolId')
  @ApiOperation({ summary: 'Quitar un rol de un usuario' })
  @ApiResponse({ status: 200, description: 'UsuarioRol eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'UsuarioRol no encontrado.' })
  @ApiParam({ name: 'usuarioId', type: 'number' })
  @ApiParam({ name: 'rolId',     type: 'number' })
  remove(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('rolId',     ParseIntPipe) rolId: number,
  ) {
    return this.usuario_rolService.remove(usuarioId, rolId);
  }
}

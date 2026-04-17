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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleFiltersDto } from './dto/pagination.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo role' })
  @ApiResponse({ status: 201, description: 'Role creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener roles',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de roles obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: RoleFiltersDto) {
    return this.rolesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un role por ID' })
  @ApiResponse({ status: 200, description: 'Role encontrado.' })
  @ApiResponse({ status: 404, description: 'Role no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del role' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un role' })
  @ApiResponse({ status: 200, description: 'Role actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Role no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del role' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un role' })
  @ApiResponse({ status: 200, description: 'Role eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Role no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del role' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}

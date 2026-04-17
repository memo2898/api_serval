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
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EmpresaFiltersDto } from './dto/pagination.dto';

@ApiTags('Empresas')
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo empresa' })
  @ApiResponse({ status: 201, description: 'Empresa creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener empresas',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de empresas obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: EmpresaFiltersDto) {
    return this.empresasService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa encontrado.' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del empresa' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un empresa' })
  @ApiResponse({ status: 200, description: 'Empresa actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del empresa' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
  ) {
    return this.empresasService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un empresa' })
  @ApiResponse({ status: 200, description: 'Empresa eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del empresa' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.remove(id);
  }
}

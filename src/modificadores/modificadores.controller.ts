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
import { ModificadoresService } from './modificadores.service';
import { CreateModificadoreDto } from './dto/create-modificadore.dto';
import { UpdateModificadoreDto } from './dto/update-modificadore.dto';
import { ModificadoreFiltersDto } from './dto/pagination.dto';

@ApiTags('Modificadores')
@Controller('modificadores')
export class ModificadoresController {
  constructor(private readonly modificadoresService: ModificadoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo modificadore' })
  @ApiResponse({ status: 201, description: 'Modificadore creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createModificadoreDto: CreateModificadoreDto) {
    return this.modificadoresService.create(createModificadoreDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener modificadores',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de modificadores obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ModificadoreFiltersDto) {
    return this.modificadoresService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un modificadore por ID' })
  @ApiResponse({ status: 200, description: 'Modificadore encontrado.' })
  @ApiResponse({ status: 404, description: 'Modificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del modificadore' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modificadoresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un modificadore' })
  @ApiResponse({ status: 200, description: 'Modificadore actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Modificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del modificadore' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModificadoreDto: UpdateModificadoreDto,
  ) {
    return this.modificadoresService.update(id, updateModificadoreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un modificadore' })
  @ApiResponse({ status: 200, description: 'Modificadore eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Modificadore no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del modificadore' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modificadoresService.remove(id);
  }
}

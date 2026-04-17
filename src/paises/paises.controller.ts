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
import { PaisesService } from './paises.service';
import { CreatePaiseDto } from './dto/create-paise.dto';
import { UpdatePaiseDto } from './dto/update-paise.dto';
import { PaiseFiltersDto } from './dto/pagination.dto';

@ApiTags('Paises')
@Controller('paises')
export class PaisesController {
  constructor(private readonly paisesService: PaisesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo paise' })
  @ApiResponse({ status: 201, description: 'Paise creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createPaiseDto: CreatePaiseDto) {
    return this.paisesService.create(createPaiseDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener paises',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de paises obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: PaiseFiltersDto) {
    return this.paisesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un paise por ID' })
  @ApiResponse({ status: 200, description: 'Paise encontrado.' })
  @ApiResponse({ status: 404, description: 'Paise no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del paise' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paisesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un paise' })
  @ApiResponse({ status: 200, description: 'Paise actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Paise no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del paise' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaiseDto: UpdatePaiseDto,
  ) {
    return this.paisesService.update(id, updatePaiseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un paise' })
  @ApiResponse({ status: 200, description: 'Paise eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Paise no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del paise' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paisesService.remove(id);
  }
}

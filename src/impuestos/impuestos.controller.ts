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
import { ImpuestosService } from './impuestos.service';
import { CreateImpuestoDto } from './dto/create-impuesto.dto';
import { UpdateImpuestoDto } from './dto/update-impuesto.dto';
import { ImpuestoFiltersDto } from './dto/pagination.dto';

@ApiTags('Impuestos')
@Controller('impuestos')
export class ImpuestosController {
  constructor(private readonly impuestosService: ImpuestosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo impuesto' })
  @ApiResponse({ status: 201, description: 'Impuesto creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createImpuestoDto: CreateImpuestoDto) {
    return this.impuestosService.create(createImpuestoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener impuestos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de impuestos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ImpuestoFiltersDto) {
    return this.impuestosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un impuesto por ID' })
  @ApiResponse({ status: 200, description: 'Impuesto encontrado.' })
  @ApiResponse({ status: 404, description: 'Impuesto no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del impuesto' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.impuestosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un impuesto' })
  @ApiResponse({ status: 200, description: 'Impuesto actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Impuesto no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del impuesto' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateImpuestoDto: UpdateImpuestoDto,
  ) {
    return this.impuestosService.update(id, updateImpuestoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un impuesto' })
  @ApiResponse({ status: 200, description: 'Impuesto eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Impuesto no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del impuesto' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.impuestosService.remove(id);
  }
}

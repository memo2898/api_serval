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
import { ArticuloImpuestosService } from './articulo_impuestos.service';
import { CreateArticuloImpuestoDto } from './dto/create-articulo_impuesto.dto';
import { UpdateArticuloImpuestoDto } from './dto/update-articulo_impuesto.dto';
import { ArticuloImpuestoFiltersDto } from './dto/pagination.dto';

@ApiTags('ArticuloImpuestos')
@Controller('articulo-impuestos')
export class ArticuloImpuestosController {
  constructor(private readonly articulo_impuestosService: ArticuloImpuestosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo articulo_impuesto' })
  @ApiResponse({ status: 201, description: 'ArticuloImpuesto creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createArticuloImpuestoDto: CreateArticuloImpuestoDto) {
    return this.articulo_impuestosService.create(createArticuloImpuestoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener articulo_impuestos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de articulo_impuestos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ArticuloImpuestoFiltersDto) {
    return this.articulo_impuestosService.findAll(filters);
  }

  @Get(':articuloId/:impuestoId')
  @ApiOperation({ summary: 'Obtener un articulo_impuesto por ID' })
  @ApiResponse({ status: 200, description: 'ArticuloImpuesto encontrado.' })
  @ApiResponse({ status: 404, description: 'ArticuloImpuesto no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo_impuesto' })
  findOne(@Param('articuloId', ParseIntPipe) articuloId: number, @Param('impuestoId', ParseIntPipe) impuestoId: number) {
    return this.articulo_impuestosService.findOne(articuloId, impuestoId);
  }

  @Patch(':articuloId/:impuestoId')
  @ApiOperation({ summary: 'Actualizar un articulo_impuesto' })
  @ApiResponse({ status: 200, description: 'ArticuloImpuesto actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'ArticuloImpuesto no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo_impuesto' })
  update(
    @Param('articuloId', ParseIntPipe) articuloId: number, @Param('impuestoId', ParseIntPipe) impuestoId: number,
    @Body() updateArticuloImpuestoDto: UpdateArticuloImpuestoDto,
  ) {
    return this.articulo_impuestosService.update(articuloId, impuestoId, updateArticuloImpuestoDto);
  }

  @Delete(':articuloId/:impuestoId')
  @ApiOperation({ summary: 'Eliminar un articulo_impuesto' })
  @ApiResponse({ status: 200, description: 'ArticuloImpuesto eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'ArticuloImpuesto no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo_impuesto' })
  remove(@Param('articuloId', ParseIntPipe) articuloId: number, @Param('impuestoId', ParseIntPipe) impuestoId: number) {
    return this.articulo_impuestosService.remove(articuloId, impuestoId);
  }
}

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
import { ArticuloAlergenosService } from './articulo_alergenos.service';
import { CreateArticuloAlergenoDto } from './dto/create-articulo_alergeno.dto';
import { UpdateArticuloAlergenoDto } from './dto/update-articulo_alergeno.dto';
import { ArticuloAlergenoFiltersDto } from './dto/pagination.dto';

@ApiTags('ArticuloAlergenos')
@Controller('articulo-alergenos')
export class ArticuloAlergenosController {
  constructor(private readonly articulo_alergenosService: ArticuloAlergenosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo articulo_alergeno' })
  @ApiResponse({ status: 201, description: 'ArticuloAlergeno creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createArticuloAlergenoDto: CreateArticuloAlergenoDto) {
    return this.articulo_alergenosService.create(createArticuloAlergenoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener articulo_alergenos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de articulo_alergenos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ArticuloAlergenoFiltersDto) {
    return this.articulo_alergenosService.findAll(filters);
  }

  @Get(':articuloId/:alergenoId')
  @ApiOperation({ summary: 'Obtener un articulo_alergeno por ID' })
  @ApiResponse({ status: 200, description: 'ArticuloAlergeno encontrado.' })
  @ApiResponse({ status: 404, description: 'ArticuloAlergeno no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo_alergeno' })
  findOne(@Param('articuloId', ParseIntPipe) articuloId: number, @Param('alergenoId', ParseIntPipe) alergenoId: number) {
    return this.articulo_alergenosService.findOne(articuloId, alergenoId);
  }

  @Patch(':articuloId/:alergenoId')
  @ApiOperation({ summary: 'Actualizar un articulo_alergeno' })
  @ApiResponse({ status: 200, description: 'ArticuloAlergeno actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'ArticuloAlergeno no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo_alergeno' })
  update(
    @Param('articuloId', ParseIntPipe) articuloId: number, @Param('alergenoId', ParseIntPipe) alergenoId: number,
    @Body() updateArticuloAlergenoDto: UpdateArticuloAlergenoDto,
  ) {
    return this.articulo_alergenosService.update(articuloId, alergenoId, updateArticuloAlergenoDto);
  }

  @Delete(':articuloId/:alergenoId')
  @ApiOperation({ summary: 'Eliminar un articulo_alergeno' })
  @ApiResponse({ status: 200, description: 'ArticuloAlergeno eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'ArticuloAlergeno no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del articulo_alergeno' })
  remove(@Param('articuloId', ParseIntPipe) articuloId: number, @Param('alergenoId', ParseIntPipe) alergenoId: number) {
    return this.articulo_alergenosService.remove(articuloId, alergenoId);
  }
}

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
import { AlergenosService } from './alergenos.service';
import { CreateAlergenoDto } from './dto/create-alergeno.dto';
import { UpdateAlergenoDto } from './dto/update-alergeno.dto';
import { AlergenoFiltersDto } from './dto/pagination.dto';

@ApiTags('Alergenos')
@Controller('alergenos')
export class AlergenosController {
  constructor(private readonly alergenosService: AlergenosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo alergeno' })
  @ApiResponse({ status: 201, description: 'Alergeno creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createAlergenoDto: CreateAlergenoDto) {
    return this.alergenosService.create(createAlergenoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener alergenos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de alergenos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: AlergenoFiltersDto) {
    return this.alergenosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un alergeno por ID' })
  @ApiResponse({ status: 200, description: 'Alergeno encontrado.' })
  @ApiResponse({ status: 404, description: 'Alergeno no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del alergeno' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alergenosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un alergeno' })
  @ApiResponse({ status: 200, description: 'Alergeno actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Alergeno no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del alergeno' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlergenoDto: UpdateAlergenoDto,
  ) {
    return this.alergenosService.update(id, updateAlergenoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un alergeno' })
  @ApiResponse({ status: 200, description: 'Alergeno eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Alergeno no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del alergeno' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.alergenosService.remove(id);
  }
}

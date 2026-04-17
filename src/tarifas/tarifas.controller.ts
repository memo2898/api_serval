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
import { TarifasService } from './tarifas.service';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';
import { TarifaFiltersDto } from './dto/pagination.dto';

@ApiTags('Tarifas')
@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tarifa' })
  @ApiResponse({ status: 201, description: 'Tarifa creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createTarifaDto: CreateTarifaDto) {
    return this.tarifasService.create(createTarifaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener tarifas',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de tarifas obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: TarifaFiltersDto) {
    return this.tarifasService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tarifa por ID' })
  @ApiResponse({ status: 200, description: 'Tarifa encontrado.' })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del tarifa' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tarifa' })
  @ApiResponse({ status: 200, description: 'Tarifa actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del tarifa' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTarifaDto: UpdateTarifaDto,
  ) {
    return this.tarifasService.update(id, updateTarifaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tarifa' })
  @ApiResponse({ status: 200, description: 'Tarifa eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del tarifa' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.remove(id);
  }
}

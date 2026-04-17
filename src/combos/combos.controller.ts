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
import { CombosService } from './combos.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { ComboFiltersDto } from './dto/pagination.dto';

@ApiTags('Combos')
@Controller('combos')
export class CombosController {
  constructor(private readonly combosService: CombosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo combo' })
  @ApiResponse({ status: 201, description: 'Combo creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createComboDto: CreateComboDto) {
    return this.combosService.create(createComboDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener combos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de combos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ComboFiltersDto) {
    return this.combosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un combo por ID' })
  @ApiResponse({ status: 200, description: 'Combo encontrado.' })
  @ApiResponse({ status: 404, description: 'Combo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del combo' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.combosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un combo' })
  @ApiResponse({ status: 200, description: 'Combo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Combo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del combo' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComboDto: UpdateComboDto,
  ) {
    return this.combosService.update(id, updateComboDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un combo' })
  @ApiResponse({ status: 200, description: 'Combo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Combo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del combo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.combosService.remove(id);
  }
}

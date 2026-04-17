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
import { MesasService } from './mesas.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { MesaFiltersDto } from './dto/pagination.dto';

@ApiTags('Mesas')
@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo mesa' })
  @ApiResponse({ status: 201, description: 'Mesa creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesasService.create(createMesaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener mesas',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de mesas obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: MesaFiltersDto) {
    return this.mesasService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un mesa por ID' })
  @ApiResponse({ status: 200, description: 'Mesa encontrado.' })
  @ApiResponse({ status: 404, description: 'Mesa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del mesa' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un mesa' })
  @ApiResponse({ status: 200, description: 'Mesa actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Mesa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del mesa' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMesaDto: UpdateMesaDto,
  ) {
    return this.mesasService.update(id, updateMesaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un mesa' })
  @ApiResponse({ status: 200, description: 'Mesa eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Mesa no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del mesa' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.remove(id);
  }
}

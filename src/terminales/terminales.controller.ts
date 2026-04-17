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
import { TerminalesService } from './terminales.service';
import { CreateTerminaleDto } from './dto/create-terminale.dto';
import { UpdateTerminaleDto } from './dto/update-terminale.dto';
import { TerminaleFiltersDto } from './dto/pagination.dto';

@ApiTags('Terminales')
@Controller('terminales')
export class TerminalesController {
  constructor(private readonly terminalesService: TerminalesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo terminale' })
  @ApiResponse({ status: 201, description: 'Terminale creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createTerminaleDto: CreateTerminaleDto) {
    return this.terminalesService.create(createTerminaleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener terminales',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de terminales obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: TerminaleFiltersDto) {
    return this.terminalesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un terminale por ID' })
  @ApiResponse({ status: 200, description: 'Terminale encontrado.' })
  @ApiResponse({ status: 404, description: 'Terminale no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del terminale' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.terminalesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un terminale' })
  @ApiResponse({ status: 200, description: 'Terminale actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Terminale no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del terminale' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTerminaleDto: UpdateTerminaleDto,
  ) {
    return this.terminalesService.update(id, updateTerminaleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un terminale' })
  @ApiResponse({ status: 200, description: 'Terminale eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Terminale no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del terminale' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.terminalesService.remove(id);
  }
}

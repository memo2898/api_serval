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
import { ReservacionesService } from './reservaciones.service';
import { CreateReservacioneDto } from './dto/create-reservacione.dto';
import { UpdateReservacioneDto } from './dto/update-reservacione.dto';
import { ReservacioneFiltersDto } from './dto/pagination.dto';

@ApiTags('Reservaciones')
@Controller('reservaciones')
export class ReservacionesController {
  constructor(private readonly reservacionesService: ReservacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo reservacione' })
  @ApiResponse({ status: 201, description: 'Reservacione creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createReservacioneDto: CreateReservacioneDto) {
    return this.reservacionesService.create(createReservacioneDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener reservaciones',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de reservaciones obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: ReservacioneFiltersDto) {
    return this.reservacionesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un reservacione por ID' })
  @ApiResponse({ status: 200, description: 'Reservacione encontrado.' })
  @ApiResponse({ status: 404, description: 'Reservacione no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del reservacione' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservacionesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un reservacione' })
  @ApiResponse({ status: 200, description: 'Reservacione actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reservacione no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del reservacione' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservacioneDto: UpdateReservacioneDto,
  ) {
    return this.reservacionesService.update(id, updateReservacioneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un reservacione' })
  @ApiResponse({ status: 200, description: 'Reservacione eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reservacione no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del reservacione' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservacionesService.remove(id);
  }
}

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
import { TipoDocumentosService } from './tipo_documentos.service';
import { CreateTipoDocumentoDto } from './dto/create-tipo_documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo_documento.dto';
import { TipoDocumentoFiltersDto } from './dto/pagination.dto';

@ApiTags('TipoDocumentos')
@Controller('tipo-documentos')
export class TipoDocumentosController {
  constructor(private readonly tipo_documentosService: TipoDocumentosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo_documento' })
  @ApiResponse({ status: 201, description: 'TipoDocumento creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createTipoDocumentoDto: CreateTipoDocumentoDto) {
    return this.tipo_documentosService.create(createTipoDocumentoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener tipo_documentos',
    description:
      'Soporta paginación y filtros opcionales por cualquier campo. ' +
      'Si no se especifica page/limit, retorna todos los registros.',
  })
  @ApiResponse({ status: 200, description: 'Lista de tipo_documentos obtenida exitosamente.' })
  @ApiQuery({ name: 'page',  required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort',  required: false, type: String, description: 'Campo:dirección (ej: id:ASC)' })
  findAll(@Query() filters: TipoDocumentoFiltersDto) {
    return this.tipo_documentosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo_documento por ID' })
  @ApiResponse({ status: 200, description: 'TipoDocumento encontrado.' })
  @ApiResponse({ status: 404, description: 'TipoDocumento no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del tipo_documento' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipo_documentosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo_documento' })
  @ApiResponse({ status: 200, description: 'TipoDocumento actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'TipoDocumento no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del tipo_documento' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto,
  ) {
    return this.tipo_documentosService.update(id, updateTipoDocumentoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo_documento' })
  @ApiResponse({ status: 200, description: 'TipoDocumento eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'TipoDocumento no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del tipo_documento' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipo_documentosService.remove(id);
  }
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max, IsString, IsBoolean } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Número de página (empezando desde 1)',
    minimum: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de elementos por página',
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ 
    example: 'created_at:DESC',
    description: 'Ordenamiento en formato campo:direccion (ASC o DESC)' 
  })
  @IsOptional()
  @IsString()
  sort?: string;
}

export class KdsOrdeneFiltersDto extends PaginationDto {

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por ID específico' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por orden_linea_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  orden_linea_id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por destino_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  destino_id?: number;

  @ApiPropertyOptional({ 
    example: 'activo', 
    description: 'Filtrar por estado (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por tiempo_recibido exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  tiempo_recibido?: string;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por tiempo_preparado exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  tiempo_preparado?: string;

}

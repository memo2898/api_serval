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

export class MovimientosCajaFiltersDto extends PaginationDto {

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
    description: 'Filtrar por turno_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  turno_id?: number;

  @ApiPropertyOptional({ 
    example: 'estándar', 
    description: 'Filtrar por tipo (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por monto' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  monto?: number;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por concepto (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  concepto?: string;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por agregado_en exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  agregado_en?: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por agregado_por' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  agregado_por?: number;

}

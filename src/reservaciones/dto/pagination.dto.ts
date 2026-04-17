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

export class ReservacioneFiltersDto extends PaginationDto {

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
    description: 'Filtrar por sucursal_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sucursal_id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por mesa_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mesa_id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por cliente_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cliente_id?: number;

  @ApiPropertyOptional({ 
    example: 'ejemplo', 
    description: 'Filtrar por nombre_contacto (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  nombre_contacto?: string;

  @ApiPropertyOptional({ 
    example: '123-456-7890', 
    description: 'Filtrar por telefono (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por fecha_hora exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  fecha_hora?: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por duracion_min' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  duracion_min?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por num_personas' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  num_personas?: number;

  @ApiPropertyOptional({ 
    example: 'activo', 
    description: 'Filtrar por estado (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por notas (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por cancelada_en exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  cancelada_en?: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por cancelada_por' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cancelada_por?: number;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por motivo_cancelacion (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  motivo_cancelacion?: string;

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

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por actualizado_en exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  actualizado_en?: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por actualizado_por' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  actualizado_por?: number;

}

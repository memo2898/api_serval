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

export class ClienteFiltersDto extends PaginationDto {

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
    description: 'Filtrar por empresa_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  empresa_id?: number;

  @ApiPropertyOptional({ 
    example: 'ejemplo', 
    description: 'Filtrar por nombre (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por apellido (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiPropertyOptional({ 
    example: 'usuario@ejemplo.com', 
    description: 'Filtrar por email (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ 
    example: '123-456-7890', 
    description: 'Filtrar por telefono (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por tipo_documento_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tipo_documento_id?: number;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por numero_documento (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  numero_documento?: string;

  @ApiPropertyOptional({ 
    example: 'Calle Ejemplo 123', 
    description: 'Filtrar por direccion (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ 
    example: 'activo', 
    description: 'Filtrar por estado (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  estado?: string;

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

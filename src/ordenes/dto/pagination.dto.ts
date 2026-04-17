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

export class OrdeneFiltersDto extends PaginationDto {

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
    description: 'Filtrar por terminal_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  terminal_id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por usuario_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  usuario_id?: number;

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
    example: 1, 
    description: 'Filtrar por turno_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  turno_id?: number;

  @ApiPropertyOptional({ 
    example: 'estándar', 
    description: 'Filtrar por tipo_servicio (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  tipo_servicio?: string;

  @ApiPropertyOptional({ 
    example: 'activo', 
    description: 'Filtrar por estado (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por numero_orden' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  numero_orden?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por descuento_total' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  descuento_total?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por subtotal' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  subtotal?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por impuestos_total' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  impuestos_total?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por total' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  total?: number;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por notas (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por fecha_apertura exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  fecha_apertura?: string;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por fecha_cierre exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  fecha_cierre?: string;

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

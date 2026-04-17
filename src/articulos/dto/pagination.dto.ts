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

export class ArticuloFiltersDto extends PaginationDto {

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
    description: 'Filtrar por familia_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  familia_id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por subfamilia_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  subfamilia_id?: number;

  @ApiPropertyOptional({ 
    example: 'ejemplo', 
    description: 'Filtrar por nombre (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ 
    example: 'descripción ejemplo', 
    description: 'Filtrar por descripcion (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por referencia (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiPropertyOptional({ 
    example: 'ABC123', 
    description: 'Filtrar por codigo_barras (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  codigo_barras?: string;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por precio_venta' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  precio_venta?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por coste' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  coste?: number;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Filtrar por tiene_stock' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  tiene_stock?: boolean;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Filtrar por vendido_por_peso' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  vendido_por_peso?: boolean;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por impuesto_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  impuesto_id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por tiempo_preparacion' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tiempo_preparacion?: number;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por imagen (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  imagen?: string;

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

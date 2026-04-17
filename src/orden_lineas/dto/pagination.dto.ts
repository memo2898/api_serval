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

export class OrdenLineaFiltersDto extends PaginationDto {

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
    description: 'Filtrar por orden_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  orden_id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por articulo_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  articulo_id?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por cantidad' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cantidad?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por precio_unitario' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  precio_unitario?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por descuento_linea' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  descuento_linea?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por impuesto_linea' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  impuesto_linea?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por subtotal_linea' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  subtotal_linea?: number;

  @ApiPropertyOptional({ 
    example: 'activo', 
    description: 'Filtrar por estado (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Filtrar por enviado_a_cocina' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  enviado_a_cocina?: boolean;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por fecha_envio exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  fecha_envio?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por notas_linea (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  notas_linea?: string;

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

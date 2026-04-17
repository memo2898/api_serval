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

export class ConfiguracionSucursalFiltersDto extends PaginationDto {

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por sucursal_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sucursal_id?: number;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Filtrar por tiene_mesas' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  tiene_mesas?: boolean;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Filtrar por tiene_delivery' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  tiene_delivery?: boolean;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Filtrar por tiene_barra' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  tiene_barra?: boolean;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por impuesto_defecto_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  impuesto_defecto_id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por tarifa_defecto_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tarifa_defecto_id?: number;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por moneda (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  moneda?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por formato_fecha (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  formato_fecha?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por zona_horaria (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  zona_horaria?: string;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Filtrar por permite_venta_sin_stock' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  permite_venta_sin_stock?: boolean;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Filtrar por requiere_mesa_para_orden' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  requiere_mesa_para_orden?: boolean;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Filtrar por imprime_automatico_al_cerrar' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  imprime_automatico_al_cerrar?: boolean;

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

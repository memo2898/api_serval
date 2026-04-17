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

export class StockFiltersDto extends PaginationDto {

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por articulo_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  articulo_id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por sucursal_id' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sucursal_id?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por cantidad_actual' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cantidad_actual?: number;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por cantidad_minima' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cantidad_minima?: number;

}

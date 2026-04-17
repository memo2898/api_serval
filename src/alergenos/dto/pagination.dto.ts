import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Type,
  //Transform
} from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
  // IsBoolean,
} from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Número de página (empezando desde 1)',
    minimum: 1,
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
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: 'created_at:DESC',
    description: 'Ordenamiento en formato campo:direccion (ASC o DESC)',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}

export class AlergenoFiltersDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar por ID específico',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiPropertyOptional({
    example: 'ejemplo',
    description: 'Filtrar por nombre (búsqueda parcial)',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    example: 'valor ejemplo',
    description: 'Filtrar por icono (búsqueda parcial)',
  })
  @IsOptional()
  @IsString()
  icono?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ReporteVentasDto {
  @ApiProperty({ example: '2025-01-01', description: 'Fecha inicio del rango (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  fecha_inicio: string;

  @ApiProperty({ example: '2025-01-31', description: 'Fecha fin del rango (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  fecha_fin: string;

  @ApiPropertyOptional({ example: 1, description: 'Filtrar por sucursal' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sucursal_id?: number;
}

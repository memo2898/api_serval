import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class CreateStockDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  articulo_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  sucursal_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  cantidad_actual?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  cantidad_minima?: number;
}

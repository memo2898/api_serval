import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateMovimientosStockDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  articulo_id: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  sucursal_id: number;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  orden_id?: number;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  agregado_en?: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  agregado_por?: number;
}

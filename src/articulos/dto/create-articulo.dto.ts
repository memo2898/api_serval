import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateArticuloDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  familia_id: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  subfamilia_id?: number;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  codigo_barras?: string;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  precio_venta: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  coste?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  tiene_stock?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  vendido_por_peso?: boolean;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  impuesto_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  tiempo_preparacion?: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  agregado_en?: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  agregado_por?: number;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  actualizado_en?: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  actualizado_por?: number;
}

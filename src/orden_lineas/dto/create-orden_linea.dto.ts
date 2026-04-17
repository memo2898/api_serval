import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateOrdenLineaDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  orden_id: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  articulo_id: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  precio_unitario: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  descuento_linea?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  impuesto_linea?: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  subtotal_linea: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  enviado_a_cocina?: boolean;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  fecha_envio?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  cuenta_num?: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  notas_linea?: string;

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

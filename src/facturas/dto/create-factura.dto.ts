import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateFacturaDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  orden_id: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  cliente_id?: number;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  numero_factura: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  subtotal: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  impuestos?: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  anulada?: boolean;

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

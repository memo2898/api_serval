import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateOrdeneDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  sucursal_id: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  terminal_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  usuario_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  mesa_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  cliente_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  turno_id?: number;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  tipo_servicio: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  numero_orden?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  descuento_total?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  impuestos_total?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  total?: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  fecha_apertura?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  fecha_cierre?: string;

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

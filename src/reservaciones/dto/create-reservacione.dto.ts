import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateReservacioneDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  sucursal_id: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  mesa_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  cliente_id?: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  nombre_contacto?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsNotEmpty()
  @IsDateString()
  fecha_hora: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  duracion_min?: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  num_personas: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  cancelada_en?: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  cancelada_por?: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  motivo_cancelacion?: string;

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

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString, IsString } from 'class-validator';

export class CreateTurnosCajaDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  terminal_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  usuario_id?: number;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  fecha_apertura?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  fecha_cierre?: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  monto_apertura?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  monto_cierre_declarado?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  monto_cierre_real?: number;

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

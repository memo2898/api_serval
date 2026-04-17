import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';

export class CreateGruposModificadoreDto {
  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  seleccion: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  obligatorio?: boolean;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  min_seleccion?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  max_seleccion?: number;

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

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateMesaDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  zona_id: number;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  capacidad?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  mesa_principal_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  posicion_x?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  posicion_y?: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ example: 4 })
  @IsOptional()
  @IsNumber()
  personas?: number;

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

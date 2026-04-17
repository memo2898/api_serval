import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateComboDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  sucursal_id?: number;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  precio: number;

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

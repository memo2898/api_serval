import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateTipoDocumentoDto {
  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  aplica_a: string;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  tipo_validacion: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  regex_validacion?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  funcion_validacion?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  formato_ejemplo?: string;

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

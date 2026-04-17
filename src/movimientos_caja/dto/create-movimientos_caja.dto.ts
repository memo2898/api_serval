import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateMovimientosCajaDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  turno_id: number;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  monto: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  concepto?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  agregado_en?: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  agregado_por?: number;
}

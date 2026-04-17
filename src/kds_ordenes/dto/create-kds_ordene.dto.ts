import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateKdsOrdeneDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  orden_linea_id: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  destino_id: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  tiempo_recibido?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  tiempo_preparado?: string;
}

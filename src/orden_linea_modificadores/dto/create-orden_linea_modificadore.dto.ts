import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrdenLineaModificadoreDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  orden_linea_id: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  modificador_id: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  precio_extra?: number;
}

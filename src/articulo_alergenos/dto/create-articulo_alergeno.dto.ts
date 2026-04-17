import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class CreateArticuloAlergenoDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  articulo_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  alergeno_id?: number;
}

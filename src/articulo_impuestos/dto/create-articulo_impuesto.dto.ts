import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class CreateArticuloImpuestoDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  articulo_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  impuesto_id?: number;
}

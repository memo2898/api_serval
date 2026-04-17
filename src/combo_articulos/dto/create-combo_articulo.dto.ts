import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class CreateComboArticuloDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  combo_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  articulo_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  cantidad?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  precio_especial?: number;
}

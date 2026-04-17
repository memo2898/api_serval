import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePreciosPorTarifaDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  articulo_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  tarifa_id?: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  precio: number;
}

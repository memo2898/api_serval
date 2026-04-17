import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateOrdenPagoDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  orden_id: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  forma_pago_id: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  monto: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  agregado_en?: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  agregado_por?: number;
}

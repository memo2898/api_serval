import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateSucursalImpuestoDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  sucursal_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  impuesto_id?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  obligatorio?: boolean;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  orden_aplicacion?: number;
}

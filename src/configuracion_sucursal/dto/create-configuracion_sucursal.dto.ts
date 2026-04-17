import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean, IsString, IsDateString } from 'class-validator';

export class CreateConfiguracionSucursalDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  sucursal_id?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  tiene_mesas?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  tiene_delivery?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  tiene_barra?: boolean;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  tarifa_defecto_id?: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  moneda?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  formato_fecha?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  zona_horaria?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  permite_venta_sin_stock?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  requiere_mesa_para_orden?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  imprime_automatico_al_cerrar?: boolean;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  actualizado_en?: string;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  actualizado_por?: number;
}

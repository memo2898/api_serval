import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePaiseDto {
  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  codigo_iso: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  moneda_defecto?: string;
}

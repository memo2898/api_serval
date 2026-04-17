import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMonedaDto {
  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  simbolo: string;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  decimales: number;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  estado?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePermisoDto {
  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  descripcion?: string;
}

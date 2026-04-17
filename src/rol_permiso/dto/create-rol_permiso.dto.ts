import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class CreateRolPermisoDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  rol_id?: number;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  permiso_id?: number;
}

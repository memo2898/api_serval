import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUsuarioRolDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  usuario_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  rol_id: number;
}

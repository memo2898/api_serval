import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ example: 'USER' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'PASS' })
  @IsString()
  @IsNotEmpty()
  pin: string;
}

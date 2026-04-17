import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMailDto {
  @ApiProperty({ example: 'user@example.com', description: 'Destinatario(s) del correo' })
  @IsNotEmpty()
  to: string | string[];

  @ApiProperty({ example: 'Asunto del correo' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: '<p>Contenido HTML del correo</p>' })
  @IsString()
  @IsNotEmpty()
  html: string;
}

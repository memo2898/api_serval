/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    description: 'Optional folder path where files will be stored',
    example: 'images/users',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9/_-]*$/, {
    message: 'Folder path can only contain letters, numbers, slashes, hyphens and underscores',
  })
  folder?: string;
}
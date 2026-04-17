import { PartialType } from '@nestjs/swagger';
import { CreateSubfamiliaDto } from './create-subfamilia.dto';

export class UpdateSubfamiliaDto extends PartialType(CreateSubfamiliaDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateModificadoreDto } from './create-modificadore.dto';

export class UpdateModificadoreDto extends PartialType(CreateModificadoreDto) {}

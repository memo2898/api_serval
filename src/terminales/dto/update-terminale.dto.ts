import { PartialType } from '@nestjs/swagger';
import { CreateTerminaleDto } from './create-terminale.dto';

export class UpdateTerminaleDto extends PartialType(CreateTerminaleDto) {}

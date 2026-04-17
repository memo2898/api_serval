import { PartialType } from '@nestjs/swagger';
import { CreateAlergenoDto } from './create-alergeno.dto';

export class UpdateAlergenoDto extends PartialType(CreateAlergenoDto) {}

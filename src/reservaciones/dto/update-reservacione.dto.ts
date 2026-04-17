import { PartialType } from '@nestjs/swagger';
import { CreateReservacioneDto } from './create-reservacione.dto';

export class UpdateReservacioneDto extends PartialType(CreateReservacioneDto) {}

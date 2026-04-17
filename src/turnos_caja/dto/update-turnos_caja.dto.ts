import { PartialType } from '@nestjs/swagger';
import { CreateTurnosCajaDto } from './create-turnos_caja.dto';

export class UpdateTurnosCajaDto extends PartialType(CreateTurnosCajaDto) {}

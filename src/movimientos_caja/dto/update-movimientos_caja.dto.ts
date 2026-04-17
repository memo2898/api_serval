import { PartialType } from '@nestjs/swagger';
import { CreateMovimientosCajaDto } from './create-movimientos_caja.dto';

export class UpdateMovimientosCajaDto extends PartialType(CreateMovimientosCajaDto) {}

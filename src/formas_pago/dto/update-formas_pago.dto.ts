import { PartialType } from '@nestjs/swagger';
import { CreateFormasPagoDto } from './create-formas_pago.dto';

export class UpdateFormasPagoDto extends PartialType(CreateFormasPagoDto) {}

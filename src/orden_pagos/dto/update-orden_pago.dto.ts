import { PartialType } from '@nestjs/swagger';
import { CreateOrdenPagoDto } from './create-orden_pago.dto';

export class UpdateOrdenPagoDto extends PartialType(CreateOrdenPagoDto) {}

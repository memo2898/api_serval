import { PartialType } from '@nestjs/swagger';
import { CreateDestinosImpresionDto } from './create-destinos_impresion.dto';

export class UpdateDestinosImpresionDto extends PartialType(CreateDestinosImpresionDto) {}

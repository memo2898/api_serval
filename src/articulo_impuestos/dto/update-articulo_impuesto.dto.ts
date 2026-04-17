import { PartialType } from '@nestjs/swagger';
import { CreateArticuloImpuestoDto } from './create-articulo_impuesto.dto';

export class UpdateArticuloImpuestoDto extends PartialType(CreateArticuloImpuestoDto) {}

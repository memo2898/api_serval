import { PartialType } from '@nestjs/swagger';
import { CreateComboArticuloDto } from './create-combo_articulo.dto';

export class UpdateComboArticuloDto extends PartialType(CreateComboArticuloDto) {}

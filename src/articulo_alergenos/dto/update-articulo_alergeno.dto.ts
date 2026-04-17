import { PartialType } from '@nestjs/swagger';
import { CreateArticuloAlergenoDto } from './create-articulo_alergeno.dto';

export class UpdateArticuloAlergenoDto extends PartialType(CreateArticuloAlergenoDto) {}

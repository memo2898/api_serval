import { PartialType } from '@nestjs/swagger';
import { CreateOrdenLineaDto } from './create-orden_linea.dto';

export class UpdateOrdenLineaDto extends PartialType(CreateOrdenLineaDto) {}

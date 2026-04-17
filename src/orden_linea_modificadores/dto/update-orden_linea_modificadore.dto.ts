import { PartialType } from '@nestjs/swagger';
import { CreateOrdenLineaModificadoreDto } from './create-orden_linea_modificadore.dto';

export class UpdateOrdenLineaModificadoreDto extends PartialType(CreateOrdenLineaModificadoreDto) {}

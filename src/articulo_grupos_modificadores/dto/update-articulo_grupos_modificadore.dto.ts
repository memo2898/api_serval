import { PartialType } from '@nestjs/swagger';
import { CreateArticuloGruposModificadoreDto } from './create-articulo_grupos_modificadore.dto';

export class UpdateArticuloGruposModificadoreDto extends PartialType(CreateArticuloGruposModificadoreDto) {}

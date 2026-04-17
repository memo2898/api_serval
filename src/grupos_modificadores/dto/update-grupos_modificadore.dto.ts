import { PartialType } from '@nestjs/swagger';
import { CreateGruposModificadoreDto } from './create-grupos_modificadore.dto';

export class UpdateGruposModificadoreDto extends PartialType(CreateGruposModificadoreDto) {}

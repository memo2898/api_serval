import { PartialType } from '@nestjs/swagger';
import { CreateKdsOrdeneDto } from './create-kds_ordene.dto';

export class UpdateKdsOrdeneDto extends PartialType(CreateKdsOrdeneDto) {}

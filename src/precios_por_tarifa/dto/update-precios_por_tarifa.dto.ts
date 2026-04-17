import { PartialType } from '@nestjs/swagger';
import { CreatePreciosPorTarifaDto } from './create-precios_por_tarifa.dto';

export class UpdatePreciosPorTarifaDto extends PartialType(CreatePreciosPorTarifaDto) {}

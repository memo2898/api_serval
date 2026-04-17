import { PartialType } from '@nestjs/swagger';
import { CreateSucursalImpuestoDto } from './create-sucursal_impuesto.dto';

export class UpdateSucursalImpuestoDto extends PartialType(CreateSucursalImpuestoDto) {}

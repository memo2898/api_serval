import { PartialType } from '@nestjs/swagger';
import { CreateConfiguracionSucursalDto } from './create-configuracion_sucursal.dto';

export class UpdateConfiguracionSucursalDto extends PartialType(CreateConfiguracionSucursalDto) {}

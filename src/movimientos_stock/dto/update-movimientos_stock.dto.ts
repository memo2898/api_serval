import { PartialType } from '@nestjs/swagger';
import { CreateMovimientosStockDto } from './create-movimientos_stock.dto';

export class UpdateMovimientosStockDto extends PartialType(CreateMovimientosStockDto) {}

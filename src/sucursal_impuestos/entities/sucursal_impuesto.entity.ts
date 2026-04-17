import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursale as Sucursal } from '../../sucursales/entities/sucursale.entity';
import { Impuesto } from '../../impuestos/entities/impuesto.entity';

@Entity('public.sucursal_impuestos')
export class SucursalImpuesto {
  @PrimaryColumn({ type: 'integer' })
  sucursal_id: number;

  @PrimaryColumn({ type: 'integer' })
  impuesto_id: number;

  @Column({ type: 'boolean', default: true })
  obligatorio: boolean;

  @Column({ type: 'integer', default: 0 })
  orden_aplicacion: number;

  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;

  @ManyToOne(() => Impuesto, { eager: true })
  @JoinColumn({ name: 'impuesto_id' })
  impuesto: Impuesto;
}

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Sucursale as Sucursal } from '../../sucursales/entities/sucursale.entity';

@Entity('public.stock')
export class Stock {
  @PrimaryColumn({ type: 'integer' })
  articulo_id: number;

  @PrimaryColumn({ type: 'integer' })
  sucursal_id: number;

  @Column({ type: "decimal" })
  cantidad_actual: number | null;

  @Column({ type: "decimal" })
  cantidad_minima: number | null;

  @ManyToOne(() => Articulo, { eager: true })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;
}

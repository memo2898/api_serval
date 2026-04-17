import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Sucursale as Sucursal } from '../../sucursales/entities/sucursale.entity';
import { Ordene as Orden } from '../../ordenes/entities/ordene.entity';

@Entity('public.movimientos_stock')
export class MovimientosStock {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  articulo_id: number;

  @Column({ type: "integer", nullable: false })
  sucursal_id: number;

  @Column({ type: "varchar", nullable: false })
  tipo: string;

  @Column({ type: "decimal", nullable: false })
  cantidad: number;

  @Column({ type: "varchar" })
  referencia: string | null;

  @Column({ type: "integer" })
  orden_id: number | null;

  @Column({ type: "timestamp" })
  agregado_en: Date | null;

  @Column({ type: "integer" })
  agregado_por: number | null;
  @ManyToOne(() => Articulo, { eager: true })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;

  @ManyToOne(() => Orden, { eager: true })
  @JoinColumn({ name: 'orden_id' })
  orden: Orden;


}

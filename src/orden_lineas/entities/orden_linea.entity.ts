import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ordene as Orden } from '../../ordenes/entities/ordene.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';

@Entity('public.orden_lineas')
export class OrdenLinea {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  orden_id: number;

  @Column({ type: "integer", nullable: false })
  articulo_id: number;

  @Column({ type: "decimal", nullable: false })
  cantidad: number;

  @Column({ type: "decimal", nullable: false })
  precio_unitario: number;

  @Column({ type: "decimal" })
  descuento_linea: number | null;

  @Column({ type: "decimal" })
  impuesto_linea: number | null;

  @Column({ type: "decimal", nullable: false })
  subtotal_linea: number;

  @Column({ type: "varchar" })
  estado: string | null;

  @Column({ type: "boolean" })
  enviado_a_cocina: boolean | null;

  @Column({ type: "timestamp" })
  fecha_envio: Date | null;

  @Column({ type: "integer", default: 1 })
  cuenta_num: number;

  @Column({ type: "text" })
  notas_linea: string | null;

  @Column({ type: "timestamp" })
  agregado_en: Date | null;

  @Column({ type: "integer" })
  agregado_por: number | null;

  @Column({ type: "timestamp" })
  actualizado_en: Date | null;

  @Column({ type: "integer" })
  actualizado_por: number | null;
  @ManyToOne(() => Orden, { eager: true })
  @JoinColumn({ name: 'orden_id' })
  orden: Orden;

  @ManyToOne(() => Articulo, { eager: true })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;


}

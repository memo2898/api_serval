import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Familia } from '../../familias/entities/familia.entity';
import { Subfamilia } from '../../subfamilias/entities/subfamilia.entity';
import { Impuesto } from '../../impuestos/entities/impuesto.entity';

@Entity('public.articulos')
export class Articulo {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  familia_id: number;

  @Column({ type: "integer" })
  subfamilia_id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "text" })
  descripcion: string | null;

  @Column({ type: "varchar" })
  referencia: string | null;

  @Column({ type: "varchar" })
  codigo_barras: string | null;

  @Column({ type: "decimal", nullable: false })
  precio_venta: number;

  @Column({ type: "decimal" })
  coste: number | null;

  @Column({ type: "boolean" })
  tiene_stock: boolean | null;

  @Column({ type: "boolean" })
  vendido_por_peso: boolean | null;

  @Column({ type: "integer" })
  impuesto_id: number | null;

  @Column({ type: "integer" })
  tiempo_preparacion: number | null;

  @Column({ type: "varchar" })
  imagen: string | null;

  @Column({ type: "varchar" })
  estado: string | null;

  @Column({ type: "timestamp" })
  agregado_en: Date | null;

  @Column({ type: "integer" })
  agregado_por: number | null;

  @Column({ type: "timestamp" })
  actualizado_en: Date | null;

  @Column({ type: "integer" })
  actualizado_por: number | null;
  @ManyToOne(() => Familia, { eager: true })
  @JoinColumn({ name: 'familia_id' })
  familia: Familia;

  @ManyToOne(() => Subfamilia, { eager: true })
  @JoinColumn({ name: 'subfamilia_id' })
  subfamilia: Subfamilia;

  @ManyToOne(() => Impuesto, { eager: true })
  @JoinColumn({ name: 'impuesto_id' })
  impuesto: Impuesto;


}

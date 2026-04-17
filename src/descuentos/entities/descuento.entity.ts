import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursale as Sucursal } from '../../sucursales/entities/sucursale.entity';

@Entity('public.descuentos')
export class Descuento {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer" })
  sucursal_id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "varchar", nullable: false })
  tipo: string;

  @Column({ type: "decimal", nullable: false })
  valor: number;

  @Column({ type: "varchar", nullable: false })
  aplica_a: string;

  @Column({ type: "boolean" })
  requiere_autorizacion: boolean | null;

  @Column({ type: "date" })
  fecha_inicio: Date | null;

  @Column({ type: "date" })
  fecha_fin: Date | null;

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
  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;


}

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursale as Sucursal } from '../../sucursales/entities/sucursale.entity';

@Entity('public.familias')
export class Familia {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer" })
  sucursal_id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "varchar" })
  color: string | null;

  @Column({ type: "varchar" })
  icono: string | null;

  @Column({ type: "integer" })
  orden_visual: number | null;

  @Column({ type: "varchar" })
  destino_impresion: string | null;

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

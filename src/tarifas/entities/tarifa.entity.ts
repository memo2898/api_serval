import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursale as Sucursal } from '../../sucursales/entities/sucursale.entity';

@Entity('public.tarifas')
export class Tarifa {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer" })
  sucursal_id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

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

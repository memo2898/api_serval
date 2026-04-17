import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Zona } from '../../zonas/entities/zona.entity';

@Entity('public.mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  zona_id: number;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "integer" })
  capacidad: number | null;

  @Column({ type: "integer", nullable: true })
  mesa_principal_id: number | null;

  @ManyToOne(() => Mesa, { nullable: true, eager: false })
  @JoinColumn({ name: 'mesa_principal_id' })
  mesa_principal: Mesa | null;

  @Column({ type: "decimal" })
  posicion_x: number | null;

  @Column({ type: "decimal" })
  posicion_y: number | null;

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
  @ManyToOne(() => Zona, { eager: true })
  @JoinColumn({ name: 'zona_id' })
  zona: Zona;


}

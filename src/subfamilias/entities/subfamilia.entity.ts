import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Familia } from '../../familias/entities/familia.entity';

@Entity('public.subfamilias')
export class Subfamilia {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  familia_id: number;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "integer" })
  orden_visual: number | null;

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


}

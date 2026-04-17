import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Paise as Pai } from '../../paises/entities/paise.entity';

@Entity('public.impuestos')
export class Impuesto {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer" })
  pais_id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "decimal", nullable: false })
  porcentaje: number;

  @Column({ type: "varchar", nullable: false })
  tipo: string;

  @Column({ type: "varchar", nullable: false })
  tipo_aplicacion: string;

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
  @ManyToOne(() => Pai, { eager: true })
  @JoinColumn({ name: 'pais_id' })
  pais: Pai;


}

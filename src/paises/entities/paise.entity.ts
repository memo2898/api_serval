import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Moneda } from '../../monedas/entities/moneda.entity';

@Entity('public.paises')
export class Paise {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ nullable: false })
  codigo_iso: string;

  @Column({ type: "integer" })
  moneda_id: number | null;
  @ManyToOne(() => Moneda, { eager: true })
  @JoinColumn({ name: 'moneda_id' })
  moneda: Moneda;


}

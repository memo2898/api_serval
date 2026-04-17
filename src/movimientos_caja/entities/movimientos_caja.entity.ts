import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TurnosCaja as Turno } from '../../turnos_caja/entities/turnos_caja.entity';

@Entity('public.movimientos_caja')
export class MovimientosCaja {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  turno_id: number;

  @Column({ type: "varchar", nullable: false })
  tipo: string;

  @Column({ type: "decimal", nullable: false })
  monto: number;

  @Column({ type: "varchar" })
  concepto: string | null;

  @Column({ type: "timestamp" })
  agregado_en: Date | null;

  @Column({ type: "integer" })
  agregado_por: number | null;
  @ManyToOne(() => Turno, { eager: true })
  @JoinColumn({ name: 'turno_id' })
  turno: Turno;


}

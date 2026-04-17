import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Terminale as Terminal } from '../../terminales/entities/terminale.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('public.turnos_caja')
export class TurnosCaja {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer" })
  terminal_id: number | null;

  @Column({ type: "integer" })
  usuario_id: number | null;

  @Column({ type: "timestamp" })
  fecha_apertura: Date | null;

  @Column({ type: "timestamp" })
  fecha_cierre: Date | null;

  @Column({ type: "decimal" })
  monto_apertura: number | null;

  @Column({ type: "decimal" })
  monto_cierre_declarado: number | null;

  @Column({ type: "decimal" })
  monto_cierre_real: number | null;

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
  @ManyToOne(() => Terminal, { eager: true })
  @JoinColumn({ name: 'terminal_id' })
  terminal: Terminal;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;


}

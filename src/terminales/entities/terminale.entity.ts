import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('public.terminales')
export class Terminale {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  sucursal_id: number;

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

  @ManyToOne(() => Usuario, { eager: false })
  @JoinColumn({ name: 'agregado_por' })
  agregado_por_usuario: Usuario;

  @ManyToOne(() => Usuario, { eager: false })
  @JoinColumn({ name: 'actualizado_por' })
  actualizado_por_usuario: Usuario;
}

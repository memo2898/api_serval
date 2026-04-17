import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('public.empresas')
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "integer" })
  tipo_documento_id: number | null;

  @Column({ type: "varchar" })
  numero_documento: string | null;

  @Column({ type: "varchar" })
  logo: string | null;

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

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { GruposModificadore as GrupoModificador } from '../../grupos_modificadores/entities/grupos_modificadore.entity';

@Entity('public.modificadores')
export class Modificadore {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  grupo_modificador_id: number;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "decimal" })
  precio_extra: number | null;

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
  @ManyToOne(() => GrupoModificador, { eager: true })
  @JoinColumn({ name: 'grupo_modificador_id' })
  grupo_modificador: GrupoModificador;


}

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('public.grupos_modificadores')
export class GruposModificadore {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "varchar", nullable: false })
  tipo: string;

  @Column({ type: "varchar", nullable: false })
  seleccion: string;

  @Column({ type: "boolean" })
  obligatorio: boolean | null;

  @Column({ type: "integer" })
  min_seleccion: number | null;

  @Column({ type: "integer" })
  max_seleccion: number | null;

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


}

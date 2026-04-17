import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('public.tipo_documentos')
export class TipoDocumento {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "varchar", nullable: false })
  tipo: string;

  @Column({ type: "varchar", nullable: false })
  aplica_a: string;

  @Column({ type: "varchar", nullable: false })
  tipo_validacion: string;

  @Column({ type: "varchar" })
  regex_validacion: string | null;

  @Column({ type: "text" })
  funcion_validacion: string | null;

  @Column({ type: "varchar" })
  formato_ejemplo: string | null;

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

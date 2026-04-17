import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { TipoDocumento } from '../../tipo_documentos/entities/tipo_documento.entity';

@Entity('public.clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer" })
  empresa_id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "varchar" })
  apellido: string | null;

  @Column({ type: "varchar" })
  email: string | null;

  @Column({ type: "varchar" })
  telefono: string | null;

  @Column({ type: "integer" })
  tipo_documento_id: number | null;

  @Column({ type: "varchar" })
  numero_documento: string | null;

  @Column({ type: "varchar" })
  direccion: string | null;

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
  @ManyToOne(() => Empresa, { eager: true })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @ManyToOne(() => TipoDocumento, { eager: true })
  @JoinColumn({ name: 'tipo_documento_id' })
  tipo_documento: TipoDocumento;


}

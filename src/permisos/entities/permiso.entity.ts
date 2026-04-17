import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('public.permisos')
export class Permiso {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "varchar", nullable: false })
  codigo: string;

  @Column({ type: "varchar" })
  descripcion: string | null;


}

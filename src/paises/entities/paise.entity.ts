import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('public.paises')
export class Paise {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ nullable: false })
  codigo_iso: string;

  @Column({ type: "varchar" })
  moneda_defecto: string | null;


}

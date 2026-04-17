import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('public.monedas')
export class Moneda {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ nullable: false })
  codigo: string;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "varchar", nullable: false })
  simbolo: string;

  @Column({ type: "integer", nullable: false })
  decimales: number;

  @Column({ type: "varchar" })
  estado: string | null;


}

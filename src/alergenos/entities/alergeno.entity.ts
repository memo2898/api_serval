import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  // ManyToOne,
  // JoinColumn,
} from 'typeorm';

@Entity('public.alergenos')
export class Alergeno {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: 'varchar', nullable: false })
  nombre: string;

  @Column({ type: 'varchar' })
  icono: string | null;
}

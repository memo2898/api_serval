import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Sucursale as Sucursal } from '../../sucursales/entities/sucursale.entity';
import { Role as Rol } from '../../roles/entities/role.entity';

@Entity('public.usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: 'integer', nullable: true })
  sucursal_id: number | null;

  @Column({ type: 'varchar', nullable: false })
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  apellido: string | null;

  @Column({ type: 'varchar', nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  pin: string;

  @Column({ type: 'varchar', nullable: true })
  estado: string | null;

  @Column({ type: 'timestamp', nullable: true })
  agregado_en: Date | null;

  @Column({ type: 'integer', nullable: true })
  agregado_por: number | null;

  @Column({ type: 'timestamp', nullable: true })
  actualizado_en: Date | null;

  @Column({ type: 'integer', nullable: true })
  actualizado_por: number | null;

  @ManyToOne(() => Sucursal, { eager: true, nullable: true })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;

  @ManyToMany(() => Rol, { eager: true })
  @JoinTable({
    name: 'usuario_rol',
    joinColumn:        { name: 'usuario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'rol_id',     referencedColumnName: 'id' },
  })
  roles: Rol[];
}

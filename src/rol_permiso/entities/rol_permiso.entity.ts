import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role as Rol } from '../../roles/entities/role.entity';
import { Permiso } from '../../permisos/entities/permiso.entity';

@Entity('public.rol_permiso')
export class RolPermiso {
  @PrimaryColumn({ type: 'integer' })
  rol_id: number;

  @PrimaryColumn({ type: 'integer' })
  permiso_id: number;

  @ManyToOne(() => Rol, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @ManyToOne(() => Permiso, { eager: true })
  @JoinColumn({ name: 'permiso_id' })
  permiso: Permiso;
}

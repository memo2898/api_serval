import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Role as Rol } from '../../roles/entities/role.entity';

@Entity('public.usuario_rol')
export class UsuarioRol {
  @PrimaryColumn({ type: 'integer' })
  usuario_id: number;

  @PrimaryColumn({ type: 'integer' })
  rol_id: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Rol, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;
}

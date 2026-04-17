import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { GruposModificadore as GrupoModificador } from '../../grupos_modificadores/entities/grupos_modificadore.entity';

@Entity('public.articulo_grupos_modificadores')
export class ArticuloGruposModificadore {
  @PrimaryColumn({ type: 'integer' })
  articulo_id: number;

  @PrimaryColumn({ type: 'integer' })
  grupo_modificador_id: number;

  @ManyToOne(() => Articulo, { eager: true })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @ManyToOne(() => GrupoModificador, { eager: true })
  @JoinColumn({ name: 'grupo_modificador_id' })
  grupo_modificador: GrupoModificador;
}

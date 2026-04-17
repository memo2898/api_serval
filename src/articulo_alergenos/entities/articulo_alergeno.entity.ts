import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Alergeno } from '../../alergenos/entities/alergeno.entity';

@Entity('public.articulo_alergenos')
export class ArticuloAlergeno {
  @PrimaryColumn({ type: 'integer' })
  articulo_id: number;

  @PrimaryColumn({ type: 'integer' })
  alergeno_id: number;

  @ManyToOne(() => Articulo, { eager: true })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @ManyToOne(() => Alergeno, { eager: true })
  @JoinColumn({ name: 'alergeno_id' })
  alergeno: Alergeno;
}

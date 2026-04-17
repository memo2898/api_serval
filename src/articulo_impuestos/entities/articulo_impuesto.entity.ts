import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Impuesto } from '../../impuestos/entities/impuesto.entity';

@Entity('public.articulo_impuestos')
export class ArticuloImpuesto {
  @PrimaryColumn({ type: 'integer' })
  articulo_id: number;

  @PrimaryColumn({ type: 'integer' })
  impuesto_id: number;

  @ManyToOne(() => Articulo, { eager: true })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @ManyToOne(() => Impuesto, { eager: true })
  @JoinColumn({ name: 'impuesto_id' })
  impuesto: Impuesto;
}

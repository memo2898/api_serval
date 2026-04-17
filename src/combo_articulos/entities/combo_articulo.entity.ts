import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Combo } from '../../combos/entities/combo.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';

@Entity('public.combo_articulos')
export class ComboArticulo {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer" })
  combo_id: number | null;

  @Column({ type: "integer" })
  articulo_id: number | null;

  @Column({ type: "integer" })
  cantidad: number | null;

  @Column({ type: "decimal" })
  precio_especial: number | null;
  @ManyToOne(() => Combo, { eager: true })
  @JoinColumn({ name: 'combo_id' })
  combo: Combo;

  @ManyToOne(() => Articulo, { eager: true })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;


}

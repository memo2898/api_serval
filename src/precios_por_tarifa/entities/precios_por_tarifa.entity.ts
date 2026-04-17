import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Tarifa } from '../../tarifas/entities/tarifa.entity';

@Entity('public.precios_por_tarifa')
export class PreciosPorTarifa {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer" })
  articulo_id: number | null;

  @Column({ type: "integer" })
  tarifa_id: number | null;

  @Column({ type: "decimal", nullable: false })
  precio: number;
  @ManyToOne(() => Articulo, { eager: true })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @ManyToOne(() => Tarifa, { eager: true })
  @JoinColumn({ name: 'tarifa_id' })
  tarifa: Tarifa;


}

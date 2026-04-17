import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrdenLinea } from '../../orden_lineas/entities/orden_linea.entity';
import { Modificadore as Modificador } from '../../modificadores/entities/modificadore.entity';

@Entity('public.orden_linea_modificadores')
export class OrdenLineaModificadore {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  orden_linea_id: number;

  @Column({ type: "integer", nullable: false })
  modificador_id: number;

  @Column({ type: "decimal" })
  precio_extra: number | null;
  @ManyToOne(() => OrdenLinea, { eager: true })
  @JoinColumn({ name: 'orden_linea_id' })
  orden_linea: OrdenLinea;

  @ManyToOne(() => Modificador, { eager: true })
  @JoinColumn({ name: 'modificador_id' })
  modificador: Modificador;


}

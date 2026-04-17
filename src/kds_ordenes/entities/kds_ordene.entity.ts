import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrdenLinea } from '../../orden_lineas/entities/orden_linea.entity';
import { DestinosImpresion as Destino } from '../../destinos_impresion/entities/destinos_impresion.entity';

@Entity('public.kds_ordenes')
export class KdsOrdene {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  orden_linea_id: number;

  @Column({ type: "integer", nullable: false })
  destino_id: number;

  @Column({ type: "varchar" })
  estado: string | null;

  @Column({ type: "timestamp" })
  tiempo_recibido: Date | null;

  @Column({ type: "timestamp" })
  tiempo_preparado: Date | null;
  @ManyToOne(() => OrdenLinea, { eager: true })
  @JoinColumn({ name: 'orden_linea_id' })
  orden_linea: OrdenLinea;

  @ManyToOne(() => Destino, { eager: true })
  @JoinColumn({ name: 'destino_id' })
  destino: Destino;


}

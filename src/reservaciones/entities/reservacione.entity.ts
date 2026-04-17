import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursale } from '../../sucursales/entities/sucursale.entity';
import { Mesa } from '../../mesas/entities/mesa.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('public.reservaciones')
export class Reservacione {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  sucursal_id: number;

  @Column({ type: "integer" })
  mesa_id: number | null;

  @Column({ type: "integer" })
  cliente_id: number | null;

  @Column({ type: "varchar" })
  nombre_contacto: string | null;

  @Column({ type: "varchar" })
  telefono: string | null;

  @Column({ type: "timestamp", nullable: false })
  fecha_hora: Date;

  @Column({ type: "integer" })
  duracion_min: number | null;

  @Column({ type: "integer", nullable: false })
  num_personas: number;

  @Column({ type: "varchar" })
  estado: string | null;

  @Column({ type: "text" })
  notas: string | null;

  @Column({ type: "timestamp" })
  cancelada_en: Date | null;

  @Column({ type: "integer" })
  cancelada_por: number | null;

  @Column({ type: "varchar" })
  motivo_cancelacion: string | null;

  @Column({ type: "timestamp" })
  agregado_en: Date | null;

  @Column({ type: "integer" })
  agregado_por: number | null;

  @Column({ type: "timestamp" })
  actualizado_en: Date | null;

  @Column({ type: "integer" })
  actualizado_por: number | null;
  @ManyToOne(() => Sucursale, { eager: true })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursale;

  @ManyToOne(() => Mesa, { eager: true })
  @JoinColumn({ name: 'mesa_id' })
  mesa: Mesa;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;


}

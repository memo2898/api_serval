import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ordene as Orden } from '../../ordenes/entities/ordene.entity';
import { FormasPago as FormaPago } from '../../formas_pago/entities/formas_pago.entity';

@Entity('public.orden_pagos')
export class OrdenPago {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  orden_id: number;

  @Column({ type: "integer", nullable: false })
  forma_pago_id: number;

  @Column({ type: "decimal", nullable: false })
  monto: number;

  @Column({ type: "varchar" })
  referencia: string | null;

  @Column({ type: "timestamp" })
  agregado_en: Date | null;

  @Column({ type: "integer" })
  agregado_por: number | null;
  @ManyToOne(() => Orden, { eager: true })
  @JoinColumn({ name: 'orden_id' })
  orden: Orden;

  @ManyToOne(() => FormaPago, { eager: true })
  @JoinColumn({ name: 'forma_pago_id' })
  forma_pago: FormaPago;


}

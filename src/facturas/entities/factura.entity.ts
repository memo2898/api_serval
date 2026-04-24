import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ordene as Orden } from '../../ordenes/entities/ordene.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('public.facturas')
export class Factura {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  orden_id: number;

  @Column({ type: "integer" })
  cliente_id: number | null;

  @Column({ type: "varchar", nullable: false })
  numero_factura: string;

  @Column({ type: "varchar" })
  tipo: string | null;

  @Column({ type: "decimal", nullable: false })
  subtotal: number;

  @Column({ type: "decimal" })
  impuestos: number | null;

  @Column({ type: "decimal", nullable: false })
  total: number;

  @Column({ type: "boolean" })
  anulada: boolean | null;

  @Column({ type: "timestamp" })
  agregado_en: Date | null;

  @Column({ type: "integer" })
  agregado_por: number | null;

  @Column({ type: "timestamp" })
  actualizado_en: Date | null;

  @Column({ type: "integer" })
  actualizado_por: number | null;

  @Column({ type: "jsonb", default: [] })
  impuestos_desglose: object[];

  @ManyToOne(() => Orden, { eager: true })
  @JoinColumn({ name: 'orden_id' })
  orden: Orden;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;


}

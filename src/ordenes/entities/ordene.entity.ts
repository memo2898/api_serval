import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursale as Sucursal } from '../../sucursales/entities/sucursale.entity';
import { Terminale as Terminal } from '../../terminales/entities/terminale.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Mesa } from '../../mesas/entities/mesa.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { TurnosCaja as Turno } from '../../turnos_caja/entities/turnos_caja.entity';

@Entity('public.ordenes')
export class Ordene {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  sucursal_id: number;

  @Column({ type: "integer" })
  terminal_id: number | null;

  @Column({ type: "integer" })
  usuario_id: number | null;

  @Column({ type: "integer" })
  mesa_id: number | null;

  @Column({ type: "integer" })
  cliente_id: number | null;

  @Column({ type: "integer" })
  turno_id: number | null;

  @Column({ type: "varchar", nullable: false })
  tipo_servicio: string;

  @Column({ type: "varchar" })
  estado: string | null;

  @Column({ type: "integer" })
  numero_orden: number | null;

  @Column({ type: "decimal" })
  descuento_total: number | null;

  @Column({ type: "decimal" })
  subtotal: number | null;

  @Column({ type: "decimal" })
  impuestos_total: number | null;

  @Column({ type: "decimal" })
  total: number | null;

  @Column({ type: "text" })
  notas: string | null;

  @Column({ type: "timestamp" })
  fecha_apertura: Date | null;

  @Column({ type: "timestamp" })
  fecha_cierre: Date | null;

  @Column({ type: "timestamp" })
  agregado_en: Date | null;

  @Column({ type: "integer" })
  agregado_por: number | null;

  @Column({ type: "timestamp" })
  actualizado_en: Date | null;

  @Column({ type: "integer" })
  actualizado_por: number | null;
  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;

  @ManyToOne(() => Terminal, { eager: true })
  @JoinColumn({ name: 'terminal_id' })
  terminal: Terminal;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Mesa, { eager: true })
  @JoinColumn({ name: 'mesa_id' })
  mesa: Mesa;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Turno, { eager: true })
  @JoinColumn({ name: 'turno_id' })
  turno: Turno;


}

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursale as Sucursal } from '../../sucursales/entities/sucursale.entity';
import { Tarifa } from '../../tarifas/entities/tarifa.entity';

@Entity('public.configuracion_sucursal')
export class ConfiguracionSucursal {
  @PrimaryColumn({ type: 'integer' })
  sucursal_id: number;

  @Column({ type: "boolean" })
  tiene_mesas: boolean | null;

  @Column({ type: "boolean" })
  tiene_delivery: boolean | null;

  @Column({ type: "boolean" })
  tiene_barra: boolean | null;

  @Column({ type: "integer" })
  tarifa_defecto_id: number | null;

  @Column({ type: "varchar" })
  moneda: string | null;

  @Column({ type: "varchar" })
  formato_fecha: string | null;

  @Column({ type: "varchar" })
  zona_horaria: string | null;

  @Column({ type: "boolean" })
  permite_venta_sin_stock: boolean | null;

  @Column({ type: "boolean" })
  requiere_mesa_para_orden: boolean | null;

  @Column({ type: "boolean" })
  imprime_automatico_al_cerrar: boolean | null;

  @Column({ type: "timestamp" })
  actualizado_en: Date | null;

  @Column({ type: "integer" })
  actualizado_por: number | null;

  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal;

  @ManyToOne(() => Tarifa, { eager: false })
  @JoinColumn({ name: 'tarifa_defecto_id' })
  tarifa_defecto: Tarifa;
}

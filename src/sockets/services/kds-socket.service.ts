import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrdenLinea } from '../../orden_lineas/entities/orden_linea.entity';
import { KdsOrdene } from '../../kds_ordenes/entities/kds_ordene.entity';
import { Ordene } from '../../ordenes/entities/ordene.entity';
import { DestinosImpresion } from '../../destinos_impresion/entities/destinos_impresion.entity';
import { OrdenLineaModificadore } from '../../orden_linea_modificadores/entities/orden_linea_modificadore.entity';
import { Mesa } from '../../mesas/entities/mesa.entity';

@Injectable()
export class KdsSocketService {
  constructor(
    @InjectRepository(OrdenLinea)
    private readonly ordenLineaRepo: Repository<OrdenLinea>,
    @InjectRepository(KdsOrdene)
    private readonly kdsOrdeneRepo: Repository<KdsOrdene>,
    @InjectRepository(Ordene)
    private readonly ordenRepo: Repository<Ordene>,
    @InjectRepository(DestinosImpresion)
    private readonly destinoRepo: Repository<DestinosImpresion>,
    @InjectRepository(OrdenLineaModificadore)
    private readonly modificadoresRepo: Repository<OrdenLineaModificadore>,
    @InjectRepository(Mesa)
    private readonly mesaRepo: Repository<Mesa>,
  ) {}

  async enviarAKds(data: { orden_id: number; linea_ids: number[] }, sucursal_id: number) {
    if (!data.linea_ids.length) {
      throw new Error('LINEAS_VACIAS');
    }

    const orden = await this.ordenRepo.findOne({ where: { id: data.orden_id } });
    if (!orden) throw new Error('ORDEN_NO_ENCONTRADA');
    if (orden.sucursal_id !== sucursal_id) throw new Error('ORDEN_NO_PERTENECE_SUCURSAL');

    const lineas = await this.ordenLineaRepo.findBy({ id: In(data.linea_ids) });
    const validas = lineas.filter((l) => l.orden_id === data.orden_id);
    const yaEnviadas = validas.filter((l) => l.enviado_a_cocina);
    const pendientes = validas.filter((l) => !l.enviado_a_cocina);

    // Idempotencia: todas ya enviadas
    if (pendientes.length === 0) {
      return {
        cocina: [],
        barra: [],
        payloadCocina: null,
        payloadBarra: null,
        sucursal_id,
        confirmacion: {
          orden_id: orden.id,
          lineas_enviadas: data.linea_ids,
          destinos: { cocina: [], barra: [] },
        },
      };
    }

    const now = new Date();
    await this.ordenLineaRepo.update(
      { id: In(pendientes.map((l) => l.id as number)) },
      { enviado_a_cocina: true, fecha_envio: now },
    );

    // Agrupar lineas por destino_impresion de su familia
    const gruposPorDestino: Record<string, OrdenLinea[]> = {};
    for (const linea of pendientes) {
      const tipo = linea.articulo?.familia?.destino_impresion;
      if (!tipo) continue;
      if (!gruposPorDestino[tipo]) gruposPorDestino[tipo] = [];
      gruposPorDestino[tipo].push(linea);
    }

    const tiposDestino = Object.keys(gruposPorDestino);
    if (!tiposDestino.length) {
      return {
        cocina: [],
        barra: [],
        payloadCocina: null,
        payloadBarra: null,
        sucursal_id,
        confirmacion: {
          orden_id: orden.id,
          lineas_enviadas: data.linea_ids,
          destinos: { cocina: [], barra: [] },
        },
      };
    }

    // Buscar destinos en BD por tipo
    const destinosDB = await this.destinoRepo.findBy({
      sucursal_id,
      tipo: In(tiposDestino),
    });
    const destinoMap: Record<string, number> = {};
    for (const d of destinosDB) {
      if (d.tipo && d.id) destinoMap[d.tipo] = d.id;
    }

    // Crear kds_ordenes y construir payloads por destino
    const result: Record<string, { kds_ids: number[]; lineas_payload: object[] }> = {};

    for (const [tipo, lineasGrupo] of Object.entries(gruposPorDestino)) {
      const destino_id = destinoMap[tipo];
      if (!destino_id) continue;

      result[tipo] = { kds_ids: [], lineas_payload: [] };

      for (const linea of lineasGrupo) {
        const mods = await this.modificadoresRepo.findBy({ orden_linea_id: linea.id as number });

        const kdsRec = this.kdsOrdeneRepo.create({
          orden_linea_id: linea.id as number,
          destino_id,
          estado: 'pendiente',
          tiempo_recibido: now,
          tiempo_preparado: null,
        });
        const savedKds = await this.kdsOrdeneRepo.save(kdsRec);
        result[tipo].kds_ids.push(savedKds.id as number);

        result[tipo].lineas_payload.push({
          kds_orden_id: savedKds.id,
          orden_linea_id: linea.id,
          articulo: linea.articulo?.nombre ?? '',
          cantidad: linea.cantidad,
          notas_linea: linea.notas_linea ?? '',
          modificadores: mods.map((m) => m.modificador?.nombre ?? ''),
          tiempo_preparacion: linea.articulo?.tiempo_preparacion ?? null,
        });
      }
    }

    const buildPayload = (tipo: string) => {
      if (!result[tipo]) return null;
      return {
        kds_orden_id: result[tipo].kds_ids[0],
        orden_id: orden.id,
        mesa: orden.mesa?.nombre ?? `Orden ${orden.numero_orden}`,
        numero_orden: orden.numero_orden,
        tipo_servicio: orden.tipo_servicio,
        tiempo_recibido: now.toISOString(),
        prioridad: 'normal',
        lineas: result[tipo].lineas_payload,
      };
    };

    const allLineasEnviadas = [
      ...pendientes.map((l) => l.id as number),
      ...yaEnviadas.map((l) => l.id as number),
    ];

    return {
      cocina: result['cocina']?.kds_ids ?? [],
      barra: result['barra']?.kds_ids ?? [],
      payloadCocina: buildPayload('cocina'),
      payloadBarra: buildPayload('barra'),
      sucursal_id,
      confirmacion: {
        orden_id: orden.id,
        lineas_enviadas: allLineasEnviadas,
        destinos: {
          cocina: (result['cocina']?.lineas_payload ?? []).map((l: any) => l.orden_linea_id),
          barra: (result['barra']?.lineas_payload ?? []).map((l: any) => l.orden_linea_id),
        },
      },
    };
  }

  async lineaEnPreparacion(kds_orden_id: number, usuario_id: number) {
    const kds = await this.kdsOrdeneRepo.findOne({ where: { id: kds_orden_id } });
    if (!kds) throw new Error('KDS_NO_ENCONTRADO');

    await this.kdsOrdeneRepo.update(kds_orden_id, { estado: 'en_preparacion' });

    const linea = await this.ordenLineaRepo.findOne({ where: { id: kds.orden_linea_id } });
    const orden = linea ? await this.ordenRepo.findOne({ where: { id: linea.orden_id } }) : null;

    return {
      sucursal_id: orden?.sucursal_id ?? 0,
      orden_id: orden?.id ?? 0,
      mesa_id: orden?.mesa_id ?? null,
      payload: {
        kds_orden_id,
        orden_linea_id: kds.orden_linea_id,
        estado: 'en_preparacion',
        usuario_id,
      },
    };
  }

  async lineaLista(kds_orden_id: number) {
    const kds = await this.kdsOrdeneRepo.findOne({ where: { id: kds_orden_id } });
    if (!kds) throw new Error('KDS_NO_ENCONTRADO');

    const now = new Date();
    await this.kdsOrdeneRepo.update(kds_orden_id, { estado: 'listo', tiempo_preparado: now });

    const linea = await this.ordenLineaRepo.findOne({ where: { id: kds.orden_linea_id } });
    const orden = linea ? await this.ordenRepo.findOne({ where: { id: linea.orden_id } }) : null;

    let ordenCompleta = false;
    if (orden) {
      const todasLineas = await this.ordenLineaRepo.findBy({ orden_id: orden.id as number });
      if (todasLineas.length) {
        const kdsParaOrden = await this.kdsOrdeneRepo.findBy({
          orden_linea_id: In(todasLineas.map((l) => l.id as number)),
        });
        ordenCompleta = kdsParaOrden.length > 0 && kdsParaOrden.every((k) => k.estado === 'listo');
      }
    }

    return {
      sucursal_id: orden?.sucursal_id ?? 0,
      orden_id: orden?.id ?? 0,
      mesa_id: orden?.mesa_id ?? null,
      ordenCompleta,
      destinoTipo: kds.destino?.tipo ?? '',
      payload: {
        kds_orden_id,
        orden_linea_id: kds.orden_linea_id,
        tiempo_preparado: now.toISOString(),
        estado: 'listo',
      },
    };
  }

  async getLineasKdsPendientes(sucursal_id: number, tipo: string) {
    const destinos = await this.destinoRepo.findBy({ sucursal_id, tipo });
    if (!destinos.length) return [];

    return this.kdsOrdeneRepo.findBy({
      destino_id: In(destinos.map((d) => d.id as number)),
      estado: In(['pendiente', 'en_preparacion']),
    });
  }
}

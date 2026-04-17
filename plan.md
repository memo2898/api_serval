# Plan - Sistema POS para Restaurantes (Inspirado en Hiopos)

---

## Filosofía del sistema

- Primera versión solo en **español**
- **Multi-empresa** (SaaS): varias empresas pueden usar el sistema, cada una con sus sucursales
- Cada sucursal puede tener **múltiples terminales POS**
- Modular: algunas funciones son opcionales por tipo de negocio (ej. mesas para restaurante, no para fastfood)

---

## MÓDULO 1 — Fundación / Tenancy

### Tabla: `empresas`
- id, nombre, ruc/nif, logo, activo
- configuración general (moneda, zona horaria, país)

### Tabla: `sucursales`
- id, empresa_id, nombre, dirección, teléfono, activo
- Configuraciones propias: impuestos por defecto, tipo de servicio habilitados

### Tabla: `terminales`
- id, sucursal_id, nombre (ej. "Caja 1"), activo
- Configuración: impresora por defecto, apertura de cajón automática

---

## MÓDULO 2 — Usuarios y Acceso

### Tabla: `roles`
- Administrador, Encargado, Vendedor (cajero), Cocinero
- Permisos granulares: qué puede ver/hacer cada rol

### Tabla: `usuarios`
- id, nombre, apellido, email, pin (para acceso rápido en TPV), rol_id, sucursal_id, activo
- El PIN es clave para el flujo de trabajo en TPV (acceso rápido sin teclado completo)

### Tabla: `permisos`
- Lista de acciones del sistema (ej. `aplicar_descuento`, `cancelar_orden`, `ver_reportes`)
- Tabla pivote `rol_permiso`

---

## MÓDULO 3 — Geografía e Impuestos

### Tablas geográficas (simplificadas para v1, extensibles)
- `paises` (id, nombre, código ISO, moneda por defecto)
- `regiones` (id, pais_id, nombre) — para v2

### Tabla: `impuestos`
- id, nombre (ej. "ITBIS", "IVA", "Propina"), porcentaje, tipo (general | específico), pais_id, activo
- `tipo_aplicacion`: sobre_precio | incluido_en_precio
- Los artículos pueden tener impuestos específicos que sobreescriben el general

---

## MÓDULO 4 — Catálogo de Productos

### Tabla: `familias`
- id, nombre, color, icono, orden_visual, activo
- `destino_impresion`: cocina | barra | caja | ninguno
  (define a dónde va la comanda de los artículos de esa familia)

### Tabla: `subfamilias`
- id, familia_id, nombre, orden_visual, activo

### Tabla: `articulos`
- id, subfamilia_id (nullable), familia_id
- nombre, descripcion, referencia, codigo_barras
- precio_venta, coste, margen, margen_porcentual (coste y margen son opcionales)
- tiene_stock (boolean), vendido_por_peso (boolean)
- activo, imagen
- `tipo_impuesto_id` (nullable, si no usa el general de la sucursal)
- `tiempo_preparacion` (minutos, para estimados en cocina)

### Tabla: `articulo_impuestos` (pivote)
- Para manejar múltiples impuestos por artículo

### Tabla: `precios_por_tarifa`
- id, articulo_id, tarifa_id, precio
- Permite tener precio de terraza, precio de barra, precio de delivery, etc.

### Tabla: `tarifas`
- id, sucursal_id, nombre (ej. "Carta", "Terraza", "Happy Hour"), activo

---

## MÓDULO 5 — Alérgenos

### Tabla: `alergenos`
- id, nombre, icono (ej. gluten, lactosa, nueces…) — basado en los 14 alérgenos de la UE

### Tabla: `articulo_alergenos` (pivote)
- articulo_id, alergeno_id

---

## MÓDULO 6 — Modificadores

### Tabla: `grupos_modificadores`
- id, nombre (ej. "Cocción", "Extras", "Comentario libre")
- `tipo`: articulo | comentario
- `seleccion`: unica | multiple
- `obligatorio`: boolean
- `min_seleccion`, `max_seleccion`

### Tabla: `modificadores`
- id, grupo_modificador_id, nombre (ej. "Poco hecho", "Término medio")
- `precio_extra` (decimal, puede ser 0)
- orden_visual, activo

### Tabla: `articulo_grupos_modificadores` (pivote)
- Para asignar qué grupos de modificadores aplican a qué artículos

---

## MÓDULO 7 — Combos y Menús

### Tabla: `combos`
- id, nombre, precio, activo
- Un combo agrupa varios artículos con un precio especial

### Tabla: `combo_articulos`
- combo_id, articulo_id, cantidad, precio_especial (nullable)

---

## MÓDULO 8 — Configuración del Salón

> Solo aplica si el negocio tiene mesas habilitadas (configuración por sucursal)

### Tabla: `zonas`
- id, sucursal_id, nombre (ej. "Terraza", "Interior", "VIP"), orden_visual, activo

### Tabla: `mesas`
- id, zona_id, numero/nombre, capacidad, posicion_x, posicion_y (para plano visual), activo
- `estado`: libre | ocupada | reservada | por_cobrar | bloqueada

---

## MÓDULO 9 — Clientes

### Tabla: `clientes`
- id, empresa_id, nombre, apellido, email, telefono, documento (RNC/cédula)
- `direccion` (para delivery)
- `puntos_fidelizacion` (para v2)
- activo

---

## MÓDULO 10 — Órdenes / Comandas (Núcleo del sistema)

### Tabla: `ordenes`
- id, sucursal_id, terminal_id, usuario_id (quien tomó la orden)
- `tipo_servicio`: mesa | barra | take_away | delivery
- mesa_id (nullable)
- cliente_id (nullable)
- `estado`: abierta | en_preparacion | lista | cobrada | cancelada | anulada
- fecha_apertura, fecha_cierre
- `numero_orden` (correlativo por sucursal y día)
- descuento_total, subtotal, impuestos_total, total
- notas

### Tabla: `orden_lineas`
- id, orden_id, articulo_id, cantidad, precio_unitario
- `estado_linea`: pendiente | en_preparacion | lista | entregada | cancelada
- descuento_linea, impuesto_linea, subtotal_linea
- notas_linea
- `enviado_a_cocina`: boolean, fecha_envio

### Tabla: `orden_linea_modificadores`
- orden_linea_id, modificador_id, precio_extra

### Tabla: `orden_pagos`
- id, orden_id, forma_pago_id, monto, referencia (para tarjeta/transferencia)
- fecha
- Una orden puede tener múltiples pagos (pago mixto)

---

## MÓDULO 11 — Formas de Pago

### Tabla: `formas_pago`
- id, sucursal_id, nombre (Efectivo, Tarjeta, Transferencia, Vale, Puntos)
- `tipo`: efectivo | electronico | credito
- requiere_referencia (boolean), activo

---

## MÓDULO 12 — Descuentos y Promociones

### Tabla: `descuentos`
- id, sucursal_id, nombre, tipo (porcentaje | monto_fijo)
- valor, `aplica_a`: orden | linea | familia | articulo
- requiere_autorizacion (boolean, ej. solo encargado puede aplicar descuentos >10%)
- activo, fecha_inicio, fecha_fin (nullable)

---

## MÓDULO 13 — Caja y Turnos

### Tabla: `turnos_caja`
- id, terminal_id, usuario_id
- fecha_apertura, fecha_cierre
- monto_apertura, monto_cierre_declarado, monto_cierre_real
- `estado`: abierto | cerrado

### Tabla: `movimientos_caja`
- id, turno_id, tipo (entrada | salida), monto, concepto, usuario_id, fecha

---

## MÓDULO 14 — Facturación / Tickets

### Tabla: `facturas`
- id, orden_id, cliente_id (nullable)
- numero_factura (correlativo fiscal), tipo (ticket | factura)
- subtotal, impuestos, total
- fecha_emision
- anulada (boolean)

### Tabla: `configuracion_impresion`
- Por sucursal: encabezado, pie de página, logo, mensaje de gracias

---

## MÓDULO 15 — Cocina / KDS

### Tabla: `destinos_impresion`
- id, sucursal_id, nombre (ej. "Cocina fría", "Cocina caliente", "Barra")
- tipo: impresora | pantalla_kds
- ip_impresora (nullable)

### Tabla: `kds_ordenes`
- Refleja las líneas enviadas a cocina con su estado en tiempo real
- orden_linea_id, destino_id, estado, tiempo_recibido, tiempo_preparado

> La asignación de destino se hereda de la familia del artículo, pero puede sobreescribirse por artículo.

---

## MÓDULO 16 — Delivery / Take-away

> Para v1 puede ser básico (solo gestión interna, sin integración externa)

### Tabla: `pedidos_delivery`
- id, orden_id, cliente_id
- direccion_entrega, referencia_direccion
- `estado`: pendiente | asignado | en_camino | entregado | cancelado
- repartidor_id (usuario), hora_estimada_entrega

---

## MÓDULO 17 — Inventario / Stock (Simplificado para v1)

### Tabla: `stock`
- articulo_id, sucursal_id, cantidad_actual, cantidad_minima (alerta)

### Tabla: `movimientos_stock`
- id, articulo_id, sucursal_id, tipo (entrada | salida | ajuste | merma)
- cantidad, referencia (orden_id o manual), fecha, usuario_id

---

## MÓDULO 18 — Reportes (Consultas, no tablas nuevas)

- Ventas por período (día, semana, mes)
- Ventas por artículo / familia
- Ventas por forma de pago
- Ranking de artículos más vendidos
- Cierres de turno / caja
- Consumo de stock
- Propinas por empleado

---

## MÓDULO 19 — Configuración General por Sucursal

### Tabla: `configuracion_sucursal`
- sucursal_id (PK)
- `tiene_mesas`: boolean
- `tiene_delivery`: boolean
- `tiene_barra`: boolean
- `impuesto_defecto_id`
- `tarifa_defecto_id`
- `moneda`, `formato_fecha`, `zona_horaria`
- `permite_venta_sin_stock`: boolean
- `requiere_mesa_para_orden`: boolean
- `imprime_automatico_al_cerrar`: boolean

---

## Flujo principal de una venta (Mesa)

```
1. Mesero selecciona mesa → crea Orden (estado: abierta)
2. Agrega artículos → crea OrdenLineas (estado: pendiente)
3. Envía a cocina → OrdenLineas cambian a "en_preparacion", se imprimen/muestran en KDS
4. Cocina marca listo → estado: lista
5. Mesero entrega → estado: entregada
6. Cliente pide cuenta → Orden pasa a "por_cobrar"
7. Cajero selecciona formas de pago → crea OrdenPagos
8. Se genera Factura/Ticket
9. Mesa vuelve a estado "libre"
```

---

## Versiones sugeridas

### v1 (MVP)
- Módulos 1-13 completos
- KDS básico (solo impresora, no pantalla)
- Delivery básico interno
- Stock básico
- Reportes esenciales

### v2
- Pantallas KDS
- Integración plataformas delivery (Glovo, Uber Eats)
- Reservaciones
- Fidelización / puntos
- Galerías de artículos
- Tablas geográficas completas
- App móvil para meseros
- Multi-idioma

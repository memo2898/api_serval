# WebSockets — Guía de Integración para el Frontend

**Sistema POS Restaurantes · api-serval**  
**Namespace:** `/pos`  
**Librería:** Socket.IO v4

---

## Índice

1. [Instalación](#1-instalación)
2. [Conexión y autenticación](#2-conexión-y-autenticación)
3. [Arquitectura de rooms](#3-arquitectura-de-rooms)
4. [Rol: Camarero / Vista de mesas](#4-rol-camarero--vista-de-mesas)
5. [Rol: Cocina (KDS)](#5-rol-cocina-kds)
6. [Rol: Barra (KDS)](#6-rol-barra-kds)
7. [Rol: Caja](#7-rol-caja)
8. [Flujo crítico: enviar orden a cocina/barra](#8-flujo-crítico-enviar-orden-a-cocinabar​ra)
9. [Manejo de errores](#9-manejo-de-errores)
10. [Reconexión y recuperación de estado](#10-reconexión-y-recuperación-de-estado)
11. [Tabla completa de eventos](#11-tabla-completa-de-eventos)

---

## 1. Instalación

```bash
npm install socket.io-client
```

---

## 2. Conexión y autenticación

La conexión se hace **una sola vez** al iniciar la aplicación, después del login.

```js
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000/pos', {
  auth: {
    token: localStorage.getItem('access_token'), // JWT del login
    sucursal_id: 1,                               // ID de la sucursal activa
    rol: 'mesas'                                  // 'mesas' | 'cocina' | 'barra' | 'caja'
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: Infinity
})

socket.on('connect', () => {
  console.log('Conectado al servidor POS')
})

socket.on('disconnect', (reason) => {
  console.warn('Desconectado:', reason)
})

socket.on('connect_error', (err) => {
  console.error('Error de conexión:', err.message)
  // Si el error es de autenticación, redirigir al login
})
```

> **Importante:** Si el JWT es inválido o expiró, el servidor cierra la conexión. Captura `connect_error` para manejar ese caso.

---

## 3. Arquitectura de rooms

Al conectarse, el servidor une automáticamente al cliente a dos rooms:

| Room | Quién está |
|---|---|
| `sucursal_{id}` | Todos los dispositivos de la sucursal |
| `sucursal_{id}_mesas` | Tablets de camareros |
| `sucursal_{id}_cocina` | Pantalla KDS de cocina |
| `sucursal_{id}_barra` | Pantalla KDS de barra |
| `sucursal_{id}_caja` | Terminales de caja |

El cliente no necesita hacer nada — el join lo hace el servidor en base al `rol` del handshake.

---

## 4. Rol: Camarero / Vista de mesas

### Al conectarse — snapshot de presencias

Inmediatamente después de conectarse, el servidor emite `mesa:presencia_actual` con el estado actual de quién está en cada mesa.

```js
socket.on('mesa:presencia_actual', ({ presencias }) => {
  // presencias = [
  //   { mesa_id: 5, usuarios: [{ usuario_id: 12, nombre: 'Carlos' }] },
  //   { mesa_id: 8, usuarios: [{ usuario_id: 7, nombre: 'Maria'  }] }
  // ]
  store.setPresencias(presencias)
})
```

### Abrir la vista de una mesa

```js
// Al navegar a la pantalla de una mesa específica
function abrirMesa(mesa_id) {
  socket.emit('mesa:usuario_entro', { mesa_id })
}
```

El servidor hace broadcast al room `_mesas`:

```js
socket.on('mesa:usuario_entro', ({ mesa_id, usuario_id, nombre, timestamp }) => {
  // Mostrar avatar del usuario sobre la mesa
  store.agregarPresencia(mesa_id, { usuario_id, nombre })
})
```

### Salir de la vista de una mesa

```js
// Al navegar fuera de la pantalla de la mesa
function salirMesa(mesa_id) {
  socket.emit('mesa:usuario_salio', { mesa_id })
}
```

```js
socket.on('mesa:usuario_salio', ({ mesa_id, usuario_id }) => {
  store.quitarPresencia(mesa_id, usuario_id)
})
```

> **Nota:** Si el usuario cierra la app o pierde conexión sin emitir `mesa:usuario_salio`, el servidor lo detecta automáticamente y emite el evento de salida por él.

### Cambio de estado de una mesa

```js
socket.on('mesa:estado_cambio', ({ mesa_id, estado_anterior, estado_nuevo, orden_id, timestamp }) => {
  // Actualizar color/ícono de la mesa en el mapa
  store.actualizarEstadoMesa(mesa_id, estado_nuevo)
})
```

---

## 5. Rol: Cocina (KDS)

### Recibir líneas nuevas

```js
socket.on('kds:nueva_linea', (payload) => {
  // payload = {
  //   kds_orden_id: 45,
  //   orden_id: 88,
  //   mesa: 'Mesa 4',
  //   numero_orden: 38,
  //   tipo_servicio: 'mesa',
  //   tiempo_recibido: '2026-04-15T14:32:00.000Z',
  //   prioridad: 'normal',
  //   lineas: [
  //     {
  //       kds_orden_id: 45,
  //       orden_linea_id: 88,
  //       articulo: 'Hamburguesa clasica',
  //       cantidad: 2,
  //       notas_linea: 'Sin cebolla',
  //       modificadores: ['Termino medio', 'Extra queso'],
  //       tiempo_preparacion: 12
  //     }
  //   ]
  // }
  store.agregarComanda(payload)
  // Reproducir sonido de alerta
})
```

### Marcar línea en preparación

```js
function iniciarPreparacion(kds_orden_id) {
  socket.emit('kds:linea_en_preparacion', { kds_orden_id })
}
```

### Marcar línea como lista

```js
function marcarLista(kds_orden_id) {
  socket.emit('kds:linea_lista', { kds_orden_id })
}
```

### Todas las líneas de la orden listas

```js
socket.on('kds:orden_completa', ({ orden_id, mesa_id }) => {
  // Opcional: mostrar animación de "orden completa"
  store.marcarOrdenCompleta(orden_id)
})
```

---

## 6. Rol: Barra (KDS)

Exactamente igual que Cocina. La única diferencia es que recibe las líneas de artículos cuya familia tiene `destino_impresion = 'barra'`.

Conectarse con `rol: 'barra'` y usar los mismos eventos:

```js
const socket = io('http://localhost:3000/pos', {
  auth: { token, sucursal_id, rol: 'barra' }
})

socket.on('kds:nueva_linea', (payload) => { ... })
socket.emit('kds:linea_en_preparacion', { kds_orden_id })
socket.emit('kds:linea_lista', { kds_orden_id })
socket.on('kds:orden_completa', (payload) => { ... })
```

---

## 7. Rol: Caja

La caja solo **escucha** eventos — el servidor los emite cuando ocurren cambios en el sistema.

```js
// Mesa solicita la cuenta → la orden pasa a "por_cobrar"
socket.on('caja:orden_lista_cobrar', (payload) => {
  // payload = {
  //   orden_id: 88, mesa: 'Mesa 4', mesa_id: 5,
  //   total: 1250.00, subtotal: 1086.96, impuestos: 163.04,
  //   descuento_total: 0, numero_orden: 38,
  //   tipo_servicio: 'mesa', timestamp: '...'
  // }
  store.agregarOrdenPendiente(payload)
  // Reproducir sonido de alerta
})

// Pago registrado
socket.on('caja:pago_registrado', (payload) => {
  // payload = {
  //   orden_id: 88, forma_pago: 'efectivo',
  //   monto: 1250.00, referencia: null,
  //   saldo_pendiente: 0, estado_orden: 'cobrada'
  // }
  store.actualizarPago(payload)
})

// Turno de otro terminal abierto
socket.on('caja:turno_abierto', ({ turno_id, terminal_id, usuario_id, timestamp }) => {
  store.registrarTurnoAbierto(turno_id, terminal_id)
})

// Turno cerrado
socket.on('caja:turno_cerrado', ({ turno_id, terminal_id, usuario_id, timestamp }) => {
  store.registrarTurnoCerrado(turno_id)
})

// Orden anulada (también llega a _mesas)
socket.on('caja:orden_anulada', ({ orden_id, mesa_id, motivo, timestamp }) => {
  store.quitarOrdenPendiente(orden_id)
})
```

---

## 8. Flujo crítico: enviar orden a cocina/barra

Este es el flujo más importante. El camarero pulsa "Enviar" y el servidor orquesta todo.

```js
async function enviarOrden(orden_id, linea_ids) {
  return new Promise((resolve, reject) => {
    // Escuchar la confirmación (una sola vez)
    socket.once('orden:lineas_confirmadas', (confirmacion) => {
      // confirmacion = {
      //   orden_id: 88,
      //   lineas_enviadas: [210, 211, 212],
      //   destinos: { cocina: [210, 211], barra: [212] }
      // }
      resolve(confirmacion)
    })

    socket.once('error:evento', (err) => {
      if (err.evento_original === 'orden:enviar_a_cocina') {
        reject(err)
      }
    })

    socket.emit('orden:enviar_a_cocina', { orden_id, linea_ids })

    // Timeout de seguridad
    setTimeout(() => reject(new Error('TIMEOUT')), 5000)
  })
}
```

**Qué pasa en el servidor:**
1. Valida que la orden pertenece a la sucursal
2. Filtra las líneas ya enviadas (idempotencia)
3. Actualiza `enviado_a_cocina = true` en BD
4. Crea los registros `kds_ordenes`
5. Emite `kds:nueva_linea` a cocina y/o barra según el destino de cada artículo
6. Confirma al camarero con `orden:lineas_confirmadas`

> **Idempotente:** Si se emite dos veces con las mismas líneas, el servidor responde con la misma confirmación sin duplicar registros en BD.

---

## 9. Manejo de errores

El servidor emite `error:evento` solo al cliente que causó el error.

```js
socket.on('error:evento', ({ evento_original, codigo, mensaje }) => {
  console.error(`[Socket error] ${evento_original} → ${codigo}: ${mensaje}`)

  switch (codigo) {
    case 'ORDEN_NO_ENCONTRADA':
      mostrarAlerta('La orden no existe')
      break
    case 'ORDEN_NO_PERTENECE_SUCURSAL':
      mostrarAlerta('No tienes acceso a esta orden')
      break
    case 'KDS_NO_ENCONTRADO':
      mostrarAlerta('Registro KDS no encontrado')
      break
    default:
      mostrarAlerta(`Error: ${mensaje}`)
  }
})
```

**Códigos de error posibles:**

| Código | Evento que lo origina | Descripción |
|---|---|---|
| `ORDEN_NO_ENCONTRADA` | `orden:enviar_a_cocina` | La orden no existe en BD |
| `ORDEN_NO_PERTENECE_SUCURSAL` | `orden:enviar_a_cocina` | La orden es de otra sucursal |
| `LINEAS_VACIAS` | `orden:enviar_a_cocina` | `linea_ids` está vacío |
| `KDS_NO_ENCONTRADO` | `kds:linea_en_preparacion`, `kds:linea_lista` | El registro KDS no existe |

---

## 10. Reconexión y recuperación de estado

Socket.IO reconecta automáticamente. Al reconectarse, el servidor une al cliente a sus rooms de nuevo. **Pero el estado en memoria se pierde** (presencias de camareros), así que al reconectar hay que hacer un fetch HTTP para recuperar el estado actual.

```js
socket.on('connect', async () => {
  if (socket.recovered) {
    // Reconexión exitosa con estado recuperado — no hace falta fetch
    return
  }

  // Primera conexión o reconexión sin recuperación: pedir estado actual
  try {
    switch (rol) {
      case 'mesas': {
        const { data } = await api.get(`/mesas?sucursal_id=${sucursal_id}`)
        store.setMesas(data)
        // mesa:presencia_actual llega automáticamente al conectarse
        break
      }
      case 'cocina': {
        const { data } = await api.get(`/kds/cocina?sucursal_id=${sucursal_id}&estado=pendiente,en_preparacion`)
        store.setComandas(data)
        break
      }
      case 'barra': {
        const { data } = await api.get(`/kds/barra?sucursal_id=${sucursal_id}&estado=pendiente,en_preparacion`)
        store.setComandas(data)
        break
      }
      case 'caja': {
        const { data } = await api.get(`/caja/ordenes-pendientes?sucursal_id=${sucursal_id}`)
        store.setOrdenesPendientes(data)
        break
      }
    }
  } catch (e) {
    console.error('Error recuperando estado tras reconexión:', e)
  }
})
```

> **Regla de oro:** El socket solo maneja **actualizaciones incrementales**. El estado completo siempre viene de la API REST.

---

## 11. Tabla completa de eventos

### Cliente → Servidor

| Evento | Quién lo emite | Payload |
|---|---|---|
| `mesa:usuario_entro` | Camarero | `{ mesa_id }` |
| `mesa:usuario_salio` | Camarero | `{ mesa_id }` |
| `orden:enviar_a_cocina` | Camarero | `{ orden_id, linea_ids[] }` |
| `kds:linea_en_preparacion` | KDS cocina / barra | `{ kds_orden_id }` |
| `kds:linea_lista` | KDS cocina / barra | `{ kds_orden_id }` |

### Servidor → Cliente

| Evento | Quién lo recibe | Payload destacado |
|---|---|---|
| `mesa:presencia_actual` | Camarero (al conectar) | `{ presencias[] }` |
| `mesa:usuario_entro` | Todos en `_mesas` | `{ mesa_id, usuario_id, nombre }` |
| `mesa:usuario_salio` | Todos en `_mesas` | `{ mesa_id, usuario_id }` |
| `mesa:estado_cambio` | Todos en `_mesas` | `{ mesa_id, estado_anterior, estado_nuevo }` |
| `orden:lineas_confirmadas` | Camarero que envió | `{ orden_id, lineas_enviadas[], destinos }` |
| `kds:nueva_linea` | `_cocina` o `_barra` | `{ kds_orden_id, mesa, lineas[] }` |
| `kds:linea_en_preparacion` | `_mesas` | `{ kds_orden_id, orden_linea_id, estado }` |
| `kds:linea_lista` | `_mesas` | `{ kds_orden_id, orden_linea_id, tiempo_preparado }` |
| `kds:orden_completa` | `_cocina`/`_barra` + `_mesas` | `{ orden_id, mesa_id }` |
| `caja:orden_lista_cobrar` | `_caja` | `{ orden_id, mesa, total, subtotal, impuestos }` |
| `caja:pago_registrado` | `_caja` + `_mesas` | `{ orden_id, forma_pago, monto, saldo_pendiente }` |
| `caja:turno_abierto` | `_caja` | `{ turno_id, terminal_id, usuario_id }` |
| `caja:turno_cerrado` | `_caja` | `{ turno_id, terminal_id, usuario_id }` |
| `caja:orden_anulada` | `_caja` + `_mesas` | `{ orden_id, mesa_id, motivo }` |
| `error:evento` | Solo el cliente que falló | `{ evento_original, codigo, mensaje }` |

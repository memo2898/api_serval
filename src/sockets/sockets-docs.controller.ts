import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  HandshakeAuthDto,
  MesaUsuarioEntroDto,
  MesaUsuarioSalioDto,
  MesaUsuarioEntroEventDto,
  MesaPresenciaActualEventDto,
  MesaEstadoCambioEventDto,
  OrdenEnviarCocinaDto,
  KdsLineaEnPreparacionDto,
  KdsLineaListaDto,
  KdsNuevaLineaEventDto,
  KdsLineasConfirmadasEventDto,
  KdsOrdenCompletaEventDto,
  CajaOrdenListaCobrarEventDto,
  CajaPagoRegistradoEventDto,
  CajaTurnoEventDto,
  CajaOrdenAnuladaEventDto,
  ErrorEventoDto,
} from './dto/socket-events.dto';

@ApiTags('WebSockets — Documentacion de Eventos')
@ApiExtraModels(
  HandshakeAuthDto,
  MesaUsuarioEntroDto,
  MesaUsuarioSalioDto,
  MesaUsuarioEntroEventDto,
  MesaPresenciaActualEventDto,
  MesaEstadoCambioEventDto,
  OrdenEnviarCocinaDto,
  KdsLineaEnPreparacionDto,
  KdsLineaListaDto,
  KdsNuevaLineaEventDto,
  KdsLineasConfirmadasEventDto,
  KdsOrdenCompletaEventDto,
  CajaOrdenListaCobrarEventDto,
  CajaPagoRegistradoEventDto,
  CajaTurnoEventDto,
  CajaOrdenAnuladaEventDto,
  ErrorEventoDto,
)
@Controller('sockets/docs')
export class SocketsDocsController {

  // ─── Conexión ───────────────────────────────────────────────────────────────

  @Post('conexion')
  @HttpCode(200)
  @ApiOperation({
    summary: 'CONEXION — Handshake auth',
    description: `
**Namespace:** \`/pos\`

Conectar con Socket.IO pasando estos datos en el campo \`auth\`:
\`\`\`js
io('/pos', {
  auth: {
    token: '<jwt>',
    sucursal_id: 1,
    rol: 'mesas'   // mesas | cocina | barra | caja
  }
})
\`\`\`

El gateway valida el JWT, une al cliente a las rooms:
- \`sucursal_{id}\` — todos los dispositivos de la sucursal
- \`sucursal_{id}_{rol}\` — solo los del mismo rol

Si \`rol = mesas\`, el servidor emite de vuelta \`mesa:presencia_actual\` con el snapshot de presencias.`,
  })
  @ApiBody({ type: HandshakeAuthDto })
  @ApiResponse({ status: 200, description: 'Estructura del handshake auth' })
  conexion(@Body() _: HandshakeAuthDto) {
    return { docs: 'Solo para documentacion Swagger — ver descripcion' };
  }

  // ─── Mesas: cliente → servidor ──────────────────────────────────────────────

  @Post('mesas/usuario-entro')
  @HttpCode(200)
  @ApiOperation({
    summary: '[CLIENTE → SERVIDOR] mesa:usuario_entro',
    description: `
El camarero emite este evento cuando abre la vista de una mesa.
El servidor registra la presencia en memoria y hace broadcast al room \`sucursal_{id}_mesas\`.

\`\`\`js
socket.emit('mesa:usuario_entro', { mesa_id: 5 })
\`\`\``,
  })
  @ApiBody({ type: MesaUsuarioEntroDto })
  @ApiResponse({ status: 200, type: MesaUsuarioEntroEventDto, description: 'Broadcast a _mesas: mesa:usuario_entro' })
  mesaUsuarioEntro(@Body() _: MesaUsuarioEntroDto) {
    return { docs: 'Solo para documentacion Swagger' };
  }

  @Post('mesas/usuario-salio')
  @HttpCode(200)
  @ApiOperation({
    summary: '[CLIENTE → SERVIDOR] mesa:usuario_salio',
    description: `
El camarero emite este evento al cerrar la vista de una mesa.
También se emite automáticamente al desconectarse.

\`\`\`js
socket.emit('mesa:usuario_salio', { mesa_id: 5 })
\`\`\``,
  })
  @ApiBody({ type: MesaUsuarioSalioDto })
  mesaUsuarioSalio(@Body() _: MesaUsuarioSalioDto) {
    return { docs: 'Solo para documentacion Swagger' };
  }

  // ─── Mesas: servidor → cliente ──────────────────────────────────────────────

  @Post('mesas/presencia-actual')
  @HttpCode(200)
  @ApiOperation({
    summary: '[SERVIDOR → CLIENTE] mesa:presencia_actual',
    description: `
Emitido solo al camarero que se conecta (\`rol = mesas\`). Contiene el snapshot
completo de qué usuarios están en qué mesas en ese momento.

\`\`\`js
socket.on('mesa:presencia_actual', ({ presencias }) => { ... })
\`\`\``,
  })
  @ApiResponse({ status: 200, type: MesaPresenciaActualEventDto })
  mesaPresenciaActual() {
    return { docs: 'Solo para documentacion Swagger' };
  }

  @Post('mesas/estado-cambio')
  @HttpCode(200)
  @ApiOperation({
    summary: '[SERVIDOR → CLIENTE] mesa:estado_cambio',
    description: `
Emitido al room \`_mesas\` cuando una mesa cambia de estado (libre → ocupada, etc.).
Originado por operaciones REST que modifican el estado de la mesa.

\`\`\`js
socket.on('mesa:estado_cambio', (payload) => { ... })
\`\`\``,
  })
  @ApiResponse({ status: 200, type: MesaEstadoCambioEventDto })
  mesaEstadoCambio() {
    return { docs: 'Solo para documentacion Swagger' };
  }

  // ─── KDS: cliente → servidor ────────────────────────────────────────────────

  @Post('kds/enviar-a-cocina')
  @HttpCode(200)
  @ApiOperation({
    summary: '[CLIENTE → SERVIDOR] orden:enviar_a_cocina',
    description: `
El camarero emite este evento al pulsar "Enviar a cocina".

**Flujo del servidor:**
1. Valida la orden y las líneas
2. Actualiza \`orden_lineas.enviado_a_cocina = true\`
3. Inserta registros en \`kds_ordenes\`
4. Agrupa líneas por \`familia.destino_impresion\` (cocina / barra)
5. Emite \`kds:nueva_linea\` a cada room destino
6. Confirma al camarero con \`orden:lineas_confirmadas\`

\`\`\`js
socket.emit('orden:enviar_a_cocina', { orden_id: 88, linea_ids: [210, 211, 212] })
\`\`\`

**Idempotente:** si las líneas ya fueron enviadas, el servidor responde con la confirmación sin duplicar registros.`,
  })
  @ApiBody({ type: OrdenEnviarCocinaDto })
  @ApiResponse({ status: 200, type: KdsLineasConfirmadasEventDto, description: 'Respuesta al camarero: orden:lineas_confirmadas' })
  ordenEnviarCocina(@Body() _: OrdenEnviarCocinaDto) {
    return { docs: 'Solo para documentacion Swagger' };
  }

  @Post('kds/linea-en-preparacion')
  @HttpCode(200)
  @ApiOperation({
    summary: '[CLIENTE → SERVIDOR] kds:linea_en_preparacion',
    description: `
La pantalla KDS emite este evento cuando el cocinero/bartender toca una línea para iniciar su preparación.
El servidor actualiza \`kds_ordenes.estado = en_preparacion\` y notifica al room \`_mesas\`.

\`\`\`js
socket.emit('kds:linea_en_preparacion', { kds_orden_id: 45 })
\`\`\``,
  })
  @ApiBody({ type: KdsLineaEnPreparacionDto })
  kdsLineaEnPreparacion(@Body() _: KdsLineaEnPreparacionDto) {
    return { docs: 'Solo para documentacion Swagger' };
  }

  @Post('kds/linea-lista')
  @HttpCode(200)
  @ApiOperation({
    summary: '[CLIENTE → SERVIDOR] kds:linea_lista',
    description: `
La pantalla KDS emite este evento cuando el plato/bebida está listo para servir.
El servidor actualiza \`kds_ordenes.estado = listo\` y notifica al room \`_mesas\`.

Si **todas** las líneas KDS de la orden pasan a \`listo\`, el servidor emite adicionalmente \`kds:orden_completa\` a los rooms correspondientes.

\`\`\`js
socket.emit('kds:linea_lista', { kds_orden_id: 45 })
\`\`\``,
  })
  @ApiBody({ type: KdsLineaListaDto })
  kdsLineaLista(@Body() _: KdsLineaListaDto) {
    return { docs: 'Solo para documentacion Swagger' };
  }

  // ─── KDS: servidor → cliente ────────────────────────────────────────────────

  @Post('kds/nueva-linea')
  @HttpCode(200)
  @ApiOperation({
    summary: '[SERVIDOR → CLIENTE] kds:nueva_linea',
    description: `
Emitido al room \`_cocina\` o \`_barra\` cuando el camarero envía una orden.
Contiene todas las líneas del batch destinadas a ese punto de preparación.

\`\`\`js
socket.on('kds:nueva_linea', (payload) => { ... })
\`\`\``,
  })
  @ApiResponse({ status: 200, type: KdsNuevaLineaEventDto })
  kdsNuevaLinea() {
    return { docs: 'Solo para documentacion Swagger' };
  }

  @Post('kds/orden-completa')
  @HttpCode(200)
  @ApiOperation({
    summary: '[SERVIDOR → CLIENTE] kds:orden_completa',
    description: `
Emitido cuando todas las líneas KDS de una orden están en estado \`listo\`.
Se envía al room destino (cocina o barra) y también a \`_mesas\`.

\`\`\`js
socket.on('kds:orden_completa', ({ orden_id, mesa_id }) => { ... })
\`\`\``,
  })
  @ApiResponse({ status: 200, type: KdsOrdenCompletaEventDto })
  kdsOrdenCompleta() {
    return { docs: 'Solo para documentacion Swagger' };
  }

  // ─── Caja: servidor → cliente ───────────────────────────────────────────────

  @Post('caja/orden-lista-cobrar')
  @HttpCode(200)
  @ApiOperation({
    summary: '[SERVIDOR → CLIENTE] caja:orden_lista_cobrar',
    description: `
Emitido al room \`_caja\` cuando una mesa pasa a estado \`por_cobrar\`.
Originado desde la API REST al actualizar el estado de la orden.

\`\`\`js
socket.on('caja:orden_lista_cobrar', (payload) => { ... })
\`\`\``,
  })
  @ApiResponse({ status: 200, type: CajaOrdenListaCobrarEventDto })
  cajaOrdenListaCobrar() {
    return { docs: 'Solo para documentacion Swagger' };
  }

  @Post('caja/pago-registrado')
  @HttpCode(200)
  @ApiOperation({
    summary: '[SERVIDOR → CLIENTE] caja:pago_registrado',
    description: `
Emitido a \`_caja\` y a \`_mesas\` cuando se registra un pago en una orden.

\`\`\`js
socket.on('caja:pago_registrado', (payload) => { ... })
\`\`\``,
  })
  @ApiResponse({ status: 200, type: CajaPagoRegistradoEventDto })
  cajaPagoRegistrado() {
    return { docs: 'Solo para documentacion Swagger' };
  }

  @Post('caja/turno-abierto')
  @HttpCode(200)
  @ApiOperation({
    summary: '[SERVIDOR → CLIENTE] caja:turno_abierto',
    description: `
Emitido al room \`_caja\` cuando se abre un turno en cualquier terminal de la sucursal.

\`\`\`js
socket.on('caja:turno_abierto', (payload) => { ... })
\`\`\``,
  })
  @ApiResponse({ status: 200, type: CajaTurnoEventDto })
  cajaTurnoAbierto() {
    return { docs: 'Solo para documentacion Swagger' };
  }

  @Post('caja/turno-cerrado')
  @HttpCode(200)
  @ApiOperation({
    summary: '[SERVIDOR → CLIENTE] caja:turno_cerrado',
    description: `
Emitido al room \`_caja\` cuando se cierra un turno.

\`\`\`js
socket.on('caja:turno_cerrado', (payload) => { ... })
\`\`\``,
  })
  @ApiResponse({ status: 200, type: CajaTurnoEventDto })
  cajaTurnoCerrado() {
    return { docs: 'Solo para documentacion Swagger' };
  }

  @Post('caja/orden-anulada')
  @HttpCode(200)
  @ApiOperation({
    summary: '[SERVIDOR → CLIENTE] caja:orden_anulada',
    description: `
Emitido a \`_caja\` y a \`_mesas\` cuando una orden es anulada.

\`\`\`js
socket.on('caja:orden_anulada', (payload) => { ... })
\`\`\``,
  })
  @ApiResponse({ status: 200, type: CajaOrdenAnuladaEventDto })
  cajaOrdenAnulada() {
    return { docs: 'Solo para documentacion Swagger' };
  }

  // ─── Error ──────────────────────────────────────────────────────────────────

  @Post('error-evento')
  @HttpCode(200)
  @ApiOperation({
    summary: '[SERVIDOR → CLIENTE] error:evento',
    description: `
Emitido solo al cliente que causó el error cuando el Gateway no puede procesar un evento.

\`\`\`js
socket.on('error:evento', ({ evento_original, codigo, mensaje }) => { ... })
\`\`\``,
  })
  @ApiResponse({ status: 200, type: ErrorEventoDto })
  errorEvento() {
    return { docs: 'Solo para documentacion Swagger' };
  }
}


SISTEMA POS RESTAURANTES
Plan de Implementacion de WebSockets
Backend: NestJS + Socket.IO
Motor de base de datos: PostgreSQL
Abril 2026
 
Indice
1.  Resumen ejecutivo
2.  Principios de diseno
3.  Arquitectura de rooms
4.  Escenario 1 — Camareros y vista de mesas
5.  Escenario 2 — Cocina (KDS)
6.  Escenario 3 — Barra (KDS)
7.  Escenario 4 — Caja
8.  Flujo critico: envio de orden a cocina / barra
9.  Manejo de reconexion y resiliencia
10. Estructura de Gateways en NestJS
11. Guia de implementacion paso a paso
12. Convenciones y estandares
 
1. Resumen ejecutivo
Este documento describe la estrategia completa de comunicacion en tiempo real para el sistema POS de restaurantes. El objetivo es que todos los dispositivos dentro de una sucursal (tablets de camareros, pantallas KDS de cocina y barra, terminales de caja) esten sincronizados al instante ante cualquier cambio de estado.
La tecnologia elegida es Socket.IO sobre NestJS (WebSockets Gateway), con una arquitectura de rooms separadas por sucursal y por rol funcional. El backend es la unica fuente de verdad — los clientes nunca se comunican entre si directamente.

2. Principios de diseno
2.1 El backend orquesta todo
Ningun cliente emite eventos directamente a otro cliente. El flujo siempre es:
  Cliente → Gateway NestJS → (BD) → emit a rooms correspondientes
Esto garantiza validacion, persistencia y auditoria en cada operacion.
2.2 Persistencia primero, socket despues
Antes de emitir cualquier evento por socket, el backend persiste el cambio en la base de datos. Si el socket falla, el estado en BD es correcto. Los clientes que se reconectan hacen un fetch HTTP inicial para recuperar el estado actual.
2.3 Rooms separadas por funcion
Cada escenario tiene su propia room. Esto evita que eventos de cocina lleguen a tablets de camareros y viceversa. Un supervisor puede suscribirse a multiples rooms sin afectar las demas.
2.4 Idempotencia en el cliente
Los clientes deben manejar eventos duplicados sin romper la UI. Si llega dos veces un evento mesa:estado_cambio con el mismo estado, la UI debe quedar igual. Esto protege contra reconexiones y reintentos.
2.5 Namespaces por contexto
Se usa un unico namespace /pos para todo el sistema. El filtrado se hace por rooms, no por namespaces, para simplificar la gestion de conexiones.

3. Arquitectura de rooms
3.1 Room principal por sucursal
Al conectarse, todo cliente se une automaticamente a:
sucursal_{sucursal_id}
Esta room es para broadcasts globales de la sucursal (alertas criticas, cierre de turno, etc.).
3.2 Rooms funcionales
Adicionalmente, cada cliente se une a la room de su rol:
sucursal_{id}_mesas      → tablets de camareros
sucursal_{id}_cocina     → pantalla KDS de cocina
sucursal_{id}_barra      → pantalla KDS de barra
sucursal_{id}_caja       → terminales de caja
3.3 Join al conectarse (ejemplo NestJS)
handleConnection(client: Socket) {
  const { sucursal_id, rol } = client.handshake.auth;
  client.join(`sucursal_${sucursal_id}`);
  client.join(`sucursal_${sucursal_id}_${rol}`);
}
3.4 Autenticacion del socket
El cliente envia en el handshake:
io('/pos', {
  auth: {
    token: '<jwt>',       // JWT del usuario
    sucursal_id: 1,
    rol: 'mesas'          // mesas | cocina | barra | caja
  }
})
El Gateway valida el JWT en el hook handleConnection antes de permitir el join a cualquier room.

 
4. Escenario 1 — Camareros y vista de mesas
4.1 Descripcion
La vista de mesas muestra en tiempo real quien esta dentro de cada mesa, el estado operativo de cada mesa (libre, ocupada, por_cobrar, etc.) y los cambios en la orden activa. Todos los camareros conectados comparten esta vista sincronizada.
4.2 Presencia en mesa
Cuando un camarero abre la vista de una mesa especifica, emite un evento de presencia. Todos los demas camareros reciben una notificacion y muestran el avatar del camarero sobre esa mesa. No hay lock duro — todos pueden entrar, pero todos saben quien mas esta dentro.
4.3 Tabla de eventos

Evento	Quién emite	Quién escucha	Descripción
mesa:usuario_entro	Camarero (cliente)	Todos en _mesas	Camarero abre la vista de una mesa
mesa:usuario_salio	Camarero / Gateway	Todos en _mesas	Camarero cierra o se desconecta
mesa:presencia_actual	Gateway (en join)	Solo el que se conecta	Snapshot de quien esta en cada mesa
mesa:estado_cambio	Gateway	Todos en _mesas	Mesa cambia de estado (libre→ocupada)
orden:item_agregado	Gateway	Todos en _mesas	Se agrega un articulo a la orden
orden:item_modificado	Gateway	Todos en _mesas	Cambia cantidad, modificador o nota
orden:item_removido	Gateway	Todos en _mesas	Se elimina un articulo
orden:linea_cancelada	Gateway	Todos en _mesas	Una linea queda cancelada
orden:enviada_cocina	Gateway	Todos en _mesas	Confirmacion: lineas enviadas a KDS

4.4 Payload: mesa:usuario_entro
{
  "mesa_id": 5,
  "usuario_id": 12,
  "nombre": "Carlos Perez",
  "avatar": "https://cdn.../carlos.jpg",
  "timestamp": "2026-04-15T14:30:00Z"
}
4.5 Payload: mesa:presencia_actual
Se emite solo al cliente que se conecta, con el estado completo de todas las mesas:
{
  "presencias": [
    {
      "mesa_id": 5,
      "usuarios": [
        { "usuario_id": 12, "nombre": "Carlos" }
      ]
    },
    {
      "mesa_id": 8,
      "usuarios": [
        { "usuario_id": 7, "nombre": "Maria" }
      ]
    }
  ]
}
4.6 Payload: mesa:estado_cambio
{
  "mesa_id": 5,
  "estado_anterior": "libre",
  "estado_nuevo": "ocupada",
  "orden_id": 88,
  "timestamp": "2026-04-15T14:30:00Z"
}
4.7 Payload: orden:item_agregado
{
  "orden_id": 88,
  "mesa_id": 5,
  "linea": {
    "orden_linea_id": 210,
    "articulo_id": 34,
    "nombre": "Hamburguesa clasica",
    "cantidad": 1,
    "precio_unitario": 350.00,
    "modificadores": ["Sin cebolla", "Termino medio"],
    "notas_linea": "",
    "estado": "pendiente"
  }
}
4.8 Manejo de desconexion de camarero
El Gateway escucha el evento disconnect de Socket.IO y emite mesa:usuario_salio automaticamente por cada mesa donde tuviera presencia registrada. Se mantiene un Map en memoria (por proceso) con las presencias activas:
presencias: Map<socket_id, { usuario_id, mesas: number[] }>
Al desconectarse, se itera el array de mesas del socket y se emite el evento de salida para cada una.

 
5. Escenario 2 — Cocina (KDS)
5.1 Descripcion
La pantalla de cocina muestra las lineas de orden que tienen destino_impresion = 'cocina' en la familia del articulo. Cada linea tiene un estado propio (pendiente → en_preparacion → listo). La pantalla no necesita saber nada sobre mesas ni camareros — solo recibe sus lineas y responde con cambios de estado.
5.2 Tabla de eventos

Evento	Quién emite	Quién escucha	Descripción
kds:nueva_linea	Gateway	Cocina (_cocina)	Llega una linea nueva a preparar
kds:linea_en_preparacion	Pantalla cocina	Gateway → _mesas	Cocinero inicia preparacion
kds:linea_lista	Pantalla cocina	Gateway → _mesas	Linea lista para servir
kds:orden_completa	Gateway	_cocina + _mesas	Todas las lineas de la orden listas

5.3 Payload: kds:nueva_linea
{
  "kds_orden_id": 45,
  "orden_id": 88,
  "mesa": "Mesa 4",
  "numero_orden": 38,
  "tipo_servicio": "mesa",
  "tiempo_recibido": "2026-04-15T14:32:00Z",
  "prioridad": "normal",
  "lineas": [
    {
      "orden_linea_id": 88,
      "articulo": "Hamburguesa clasica",
      "cantidad": 2,
      "notas_linea": "Sin cebolla",
      "modificadores": ["Termino medio", "Extra queso"],
      "tiempo_preparacion": 12
    }
  ]
}
5.4 Payload: kds:linea_en_preparacion
La pantalla de cocina emite este evento cuando el cocinero toca la linea:
{
  "kds_orden_id": 45,
  "orden_linea_id": 88,
  "usuario_id": 3
}
El Gateway actualiza kds_ordenes.estado = 'en_preparacion' y reenvia a _mesas para que el camarero vea el cambio.
5.5 Payload: kds:linea_lista
{
  "kds_orden_id": 45,
  "orden_linea_id": 88,
  "tiempo_preparado": "2026-04-15T14:44:00Z"
}
5.6 Reconexion de pantalla KDS
Al reconectarse, la pantalla hace:
GET /api/kds/cocina?sucursal_id=1&estado=pendiente,en_preparacion
Y renderiza las lineas pendientes. El socket solo maneja actualizaciones desde ese punto. Esto garantiza que ninguna comanda se pierda aunque la pantalla se reinicie.

 
6. Escenario 3 — Barra (KDS)
6.1 Descripcion
La barra funciona exactamente igual que la cocina en estructura de eventos y payloads. La unica diferencia es que recibe lineas cuya familia tiene destino_impresion = 'barra'. Son rooms separadas, Gateways compartidos.
6.2 Tabla de eventos

Evento	Quién emite	Quién escucha	Descripción
kds:nueva_linea	Gateway	Barra (_barra)	Llega una linea nueva a preparar
kds:linea_en_preparacion	Pantalla barra	Gateway → _mesas	Bartender inicia preparacion
kds:linea_lista	Pantalla barra	Gateway → _mesas	Bebida lista para servir
kds:orden_completa	Gateway	_barra + _mesas	Todas las lineas de barra listas

6.3 Nota sobre ordenes mixtas
Una orden puede tener articulos para cocina Y para barra al mismo tiempo. El Gateway emite kds:nueva_linea a cada room de forma independiente, con solo las lineas que corresponden a ese destino. El evento kds:orden_completa solo se emite cuando TODAS las lineas de la orden (en ambos destinos) estan en estado 'listo'.

7. Escenario 4 — Caja
7.1 Descripcion
La caja recibe notificaciones de ordenes listas para cobrar, gestion de turnos y confirmacion de pagos. Si hay multiples terminales en la misma sucursal, todas estan en la misma room y se sincronizan entre si.
7.2 Tabla de eventos

Evento	Quién emite	Quién escucha	Descripción
caja:orden_lista_cobrar	Gateway	_caja	Mesa pasa a estado por_cobrar
caja:turno_abierto	Gateway	_caja	Se abre un turno en un terminal
caja:turno_cerrado	Gateway	_caja	Se cierra un turno
caja:pago_registrado	Gateway	_caja + _mesas	Se registra un pago en una orden
caja:factura_emitida	Gateway	_caja	Se genera ticket o factura
caja:orden_anulada	Gateway	_caja + _mesas	Una orden es anulada

7.3 Payload: caja:orden_lista_cobrar
{
  "orden_id": 88,
  "mesa": "Mesa 4",
  "mesa_id": 5,
  "total": 1250.00,
  "subtotal": 1086.96,
  "impuestos": 163.04,
  "descuento_total": 0,
  "numero_orden": 38,
  "tipo_servicio": "mesa",
  "timestamp": "2026-04-15T15:10:00Z"
}
7.4 Payload: caja:pago_registrado
{
  "orden_id": 88,
  "forma_pago": "efectivo",
  "monto": 1250.00,
  "referencia": null,
  "saldo_pendiente": 0,
  "estado_orden": "cobrada"
}

 
8. Flujo critico: envio de orden a cocina / barra
8.1 Descripcion del flujo completo
Este es el flujo mas importante del sistema. Cuando el camarero pulsa 'Enviar a cocina', se desencadena la siguiente secuencia:
Paso 1 — Camarero emite al Gateway:
socket.emit('orden:enviar_a_cocina', {
  orden_id: 88,
  linea_ids: [210, 211, 212]
})
Paso 2 — Gateway valida y persiste:
•	Valida que el usuario tiene permiso sobre la orden
•	Verifica que las lineas no hayan sido enviadas ya (enviado_a_cocina = false)
•	Actualiza orden_lineas: enviado_a_cocina = true, fecha_envio = NOW()
•	Inserta registros en kds_ordenes con estado 'pendiente'
Paso 3 — Gateway determina destinos:
•	Lee el destino_impresion de la familia de cada articulo en las lineas
•	Agrupa lineas por destino: { cocina: [210, 211], barra: [212] }
Paso 4 — Gateway emite a las rooms correspondientes:
server.to(`sucursal_1_cocina`).emit('kds:nueva_linea', payloadCocina)
server.to(`sucursal_1_barra`).emit('kds:nueva_linea', payloadBarra)
Paso 5 — Gateway confirma al camarero:
client.emit('orden:lineas_confirmadas', {
  orden_id: 88,
  lineas_enviadas: [210, 211, 212],
  destinos: { cocina: [210, 211], barra: [212] }
})
Paso 6 — Gateway actualiza estado de mesa si aplica:
•	Si la orden pasa a estado 'en_preparacion', emite mesa:estado_cambio a _mesas
8.2 Regla de idempotencia en el envio
Si el camarero envia las mismas lineas dos veces (doble tap, reconexion), el Gateway detecta que enviado_a_cocina ya es true y descarta el duplicado silenciosamente, respondiendo con el mismo evento de confirmacion para no bloquear la UI.

 
9. Manejo de reconexion y resiliencia
9.1 Estrategia general
Socket.IO maneja la reconexion automaticamente en el cliente. Al reconectarse, el cliente debe:
•	Volver a unirse a sus rooms (el Gateway lo hace en handleConnection)
•	Hacer un fetch HTTP para recuperar el estado actual
•	Reiniciar su UI con los datos frescos
•	A partir de ese punto, el socket maneja solo actualizaciones incrementales
9.2 Endpoints de recuperacion de estado
GET /api/mesas?sucursal_id=1
Devuelve todas las mesas con su estado y presencias activas.
GET /api/kds/cocina?sucursal_id=1&estado=pendiente,en_preparacion
Devuelve todas las lineas pendientes de cocina.
GET /api/kds/barra?sucursal_id=1&estado=pendiente,en_preparacion
Devuelve todas las lineas pendientes de barra.
GET /api/caja/ordenes-pendientes?sucursal_id=1
Devuelve ordenes en estado por_cobrar.
9.3 Presencias en memoria vs. persistidas
Las presencias de camareros en mesas son efimeras — se guardan en un Map en memoria del proceso NestJS, NO en la base de datos. Si el servidor se reinicia, las presencias se pierden y cada camarero debe volver a entrar a su mesa. Esto es aceptable porque:
•	Las presencias son informacion de conveniencia, no de negocio
•	Los datos reales (ordenes, estados) siempre estan en BD
•	Un reinicio del servidor es un evento inusual en produccion
9.4 Timeout de presencia
Si un camarero pierde conexion sin emitir mesa:usuario_salio, el Gateway detecta la desconexion via el evento disconnect de Socket.IO (se dispara automaticamente) y limpia la presencia del Map. No se necesita heartbeat manual.

 
10. Estructura de Gateways en NestJS
10.1 Arquitectura de modulos
Se propone un unico Gateway principal con servicios especializados:
src/
  sockets/
    sockets.gateway.ts        ← Gateway principal (conexion, rooms, auth)
    sockets.module.ts
    handlers/
      mesas.handler.ts        ← Logica de eventos de mesas
      kds.handler.ts          ← Logica de cocina y barra
      caja.handler.ts         ← Logica de caja
    services/
      presencia.service.ts    ← Map en memoria de presencias
      rooms.service.ts        ← Helper para emitir a rooms
10.2 Gateway principal (esqueleto)
@WebSocketGateway({ namespace: '/pos', cors: true })
export class SocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    const { sucursal_id, rol } = client.handshake.auth;
    // 1. Validar JWT
    // 2. Join a rooms
    client.join(`sucursal_${sucursal_id}`);
    client.join(`sucursal_${sucursal_id}_${rol}`);
    // 3. Si es camarero, emitir presencia_actual
    if (rol === 'mesas') {
      const presencias = this.presenciaService.getAll(sucursal_id);
      client.emit('mesa:presencia_actual', { presencias });
    }
  }

  async handleDisconnect(client: Socket) {
    // Limpiar presencias del camarero desconectado
    const mesas = this.presenciaService.getSalida(client.id);
    mesas.forEach(mesa_id => {
      this.server
        .to(`sucursal_${sucursal_id}_mesas`)
        .emit('mesa:usuario_salio', { mesa_id, usuario_id });
    });
    this.presenciaService.limpiar(client.id);
  }
}
10.3 Handler de mesas (esqueleto)
@SubscribeMessage('mesa:usuario_entro')
handleUsuarioEntro(client: Socket, data: { mesa_id: number }) {
  const { usuario_id, nombre, sucursal_id } = client.handshake.auth;
  this.presenciaService.registrar(client.id, usuario_id, data.mesa_id);
  this.server
    .to(`sucursal_${sucursal_id}_mesas`)
    .emit('mesa:usuario_entro', { mesa_id: data.mesa_id, usuario_id, nombre });
}
10.4 Handler de KDS — envio a cocina/barra
@SubscribeMessage('orden:enviar_a_cocina')
async handleEnviarCocina(client: Socket, data: { orden_id, linea_ids }) {
  // 1. Persistir en BD
  const result = await this.ordenesService.enviarAKds(data);
  // 2. Emitir por destino
  if (result.cocina.length) {
    this.server
      .to(`sucursal_${sucursal_id}_cocina`)
      .emit('kds:nueva_linea', result.payloadCocina);
  }
  if (result.barra.length) {
    this.server
      .to(`sucursal_${sucursal_id}_barra`)
      .emit('kds:nueva_linea', result.payloadBarra);
  }
  // 3. Confirmar al camarero
  client.emit('orden:lineas_confirmadas', result.confirmacion);
}

 
11. Guia de implementacion paso a paso
Fase 1 — Setup base (dia 1)
•	Instalar @nestjs/websockets, @nestjs/platform-socket.io, socket.io
•	Crear SocketsModule y SocketsGateway con handleConnection y handleDisconnect
•	Implementar autenticacion JWT en el handshake
•	Implementar el join a rooms por sucursal y rol
•	Crear PresenciaService con Map en memoria
•	Probar conexion con Postman WebSocket o script de prueba
Fase 2 — Escenario mesas (dia 2-3)
•	Implementar mesa:usuario_entro y mesa:usuario_salio
•	Implementar mesa:presencia_actual al conectarse
•	Implementar mesa:estado_cambio (llamado desde OrdenesService al cambiar estado)
•	Implementar orden:item_agregado / modificado / removido
•	Probar con dos clientes simultaneos
Fase 3 — Escenario KDS (dia 4-5)
•	Implementar orden:enviar_a_cocina con logica de destinos
•	Implementar kds:linea_en_preparacion desde pantalla KDS
•	Implementar kds:linea_lista y kds:orden_completa
•	Implementar endpoint REST de recuperacion de estado para reconexion
•	Probar flujo completo: camarero envia → cocina recibe → cocina marca listo → camarero ve cambio
Fase 4 — Escenario caja (dia 6)
•	Implementar caja:orden_lista_cobrar (desde OrdenesService al marcar por_cobrar)
•	Implementar caja:pago_registrado
•	Implementar caja:turno_abierto / cerrado
•	Probar con multiples terminales de caja
Fase 5 — Resiliencia y pruebas (dia 7)
•	Probar desconexion y reconexion de cada tipo de cliente
•	Verificar que las presencias se limpian al desconectarse
•	Verificar idempotencia en eventos duplicados
•	Probar con carga: multiples camareros, multiples ordenes simultaneas

12. Convenciones y estandares
12.1 Nomenclatura de eventos
Formato: entidad:accion en snake_case. Ejemplos:
•	mesa:usuario_entro — entidad 'mesa', accion 'usuario_entro'
•	kds:linea_lista — entidad 'kds', accion 'linea_lista'
•	caja:pago_registrado — entidad 'caja', accion 'pago_registrado'
12.2 Estructura de payload
Todo payload incluye siempre:
•	El ID principal de la entidad afectada (orden_id, mesa_id, etc.)
•	El sucursal_id cuando sea necesario para el cliente
•	Un timestamp ISO 8601 cuando el tiempo importa
Nunca se incluyen datos sensibles (contrasenas, tokens) en payloads de socket.
12.3 Manejo de errores
Si el Gateway no puede procesar un evento, emite un evento de error solo al cliente que lo envio:
client.emit('error:evento', {
  evento_original: 'orden:enviar_a_cocina',
  codigo: 'ORDEN_NO_ENCONTRADA',
  mensaje: 'La orden 88 no existe o no pertenece a esta sucursal'
})
12.4 Versioning
El namespace incluye version cuando haya breaking changes: /pos/v2. Esto permite mantener clientes en version anterior mientras se migra.
12.5 Logging
Cada evento recibido por el Gateway debe loggearse con:
•	socket_id del cliente
•	usuario_id y sucursal_id
•	Nombre del evento
•	Timestamp
•	Resultado (ok / error)
Esto facilita el debugging en produccion sin necesidad de reproducir el escenario.

Documento generado para uso con Claude Code — Abril 2026

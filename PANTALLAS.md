# Especificación de Pantallas Operacionales — Sistema POS Restaurante

## Contexto general

- Frontend: **React + TypeScript** (Vite)
- Backend: API REST en NestJS corriendo en `http://localhost:4809`
- Autenticación: JWT en header `Authorization: Bearer <token>`
- Router: `react-router-dom` v6
- Las pantallas deben ser **responsive para tablet** (mínimo 768px)
- Diseño táctil: botones grandes, sin hover-only, sin inputs de teclado innecesarios
- Paleta: fondo oscuro `#1a1a2e`, acentos en `#e94560`, superficies en `#16213e`
- Estilos: CSS Modules o un único `pos.css` global (sin Tailwind, sin UI libraries)

---

## Estructura de archivos sugerida

```
src/
├── api/
│   └── api.ts                  ← fetch wrapper con auth + redirect 401
├── pages/
│   ├── Login.tsx
│   ├── Mesas.tsx
│   ├── TPV.tsx
│   └── Cobro.tsx
├── components/
│   ├── MesaCard.tsx
│   ├── FamiliaTab.tsx
│   ├── ArticuloCard.tsx
│   ├── OrdenLinea.tsx
│   ├── ModificadoresModal.tsx
│   ├── PagoItem.tsx
│   └── Toast.tsx
├── hooks/
│   ├── useToast.ts
│   └── usePolling.ts
├── types/
│   └── pos.types.ts            ← interfaces TypeScript de todos los DTOs
├── App.tsx                     ← rutas con react-router
├── main.tsx
└── pos.css
```

---

## api/api.ts

```typescript
const API_URL = 'http://localhost:4809';

export async function api<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const token = localStorage.getItem('pos_token');
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (res.status === 401) {
    window.location.href = '/';
    throw new Error('No autorizado');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Error ${res.status}`);
  }
  return res.json();
}
```

---

## App.tsx — Rutas

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Mesas from './pages/Mesas';
import TPV from './pages/TPV';
import Cobro from './pages/Cobro';

function PrivateRoute({ children }: { children: JSX.Element }) {
  return localStorage.getItem('pos_token') ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mesas" element={<PrivateRoute><Mesas /></PrivateRoute>} />
        <Route path="/tpv/:ordenId" element={<PrivateRoute><TPV /></PrivateRoute>} />
        <Route path="/cobro/:ordenId" element={<PrivateRoute><Cobro /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Navegación entre pantallas:**
```
Login → /mesas → /tpv/:ordenId → /cobro/:ordenId → /mesas
```

---

## types/pos.types.ts

```typescript
export interface Zona { id: number; nombre: string; }
export interface Mesa { id: number; nombre: string; estado: MesaEstado; zona_id: number; }
export type MesaEstado = 'libre' | 'ocupada' | 'por_cobrar' | 'reservada' | 'bloqueada';

export interface Familia { id: number; nombre: string; color?: string; }
export interface Articulo { id: number; nombre: string; precio: number; imagen_url?: string; familia_id: number; }
export interface GrupoModificador { id: number; nombre: string; seleccion: 'unica' | 'multiple'; obligatorio: boolean; }
export interface Modificador { id: number; nombre: string; precio_extra: number; grupo_modificador_id: number; }

export interface Orden {
  id: number; numero: string; mesa_id: number; estado: string;
  subtotal: number; impuestos: number; propina: number; total: number;
  num_comensales: number;
  notas?: string;
}
export interface OrdenLinea {
  id: number; orden_id: number; articulo_id: number; nombre_articulo: string;
  cantidad: number; precio_unitario: number; subtotal_linea: number; estado: string;
  modificadores?: OrdenLineaModificador[];
}
export interface OrdenLineaModificador { id: number; nombre_modificador: string; precio_extra: number; }

export interface FormaPago { id: number; nombre: string; }
export interface OrdenPago { id: number; forma_pago_id: number; nombre_forma_pago: string; monto: number; }
```

---

## PANTALLA 0 — Login (`pages/Login.tsx`)

### Layout
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              🍽 ServalPOS                        │
│                                                 │
│         [ correo@email.com          ]           │
│         [ ••••••••••••••••          ]           │
│                                                 │
│              [ ENTRAR ]                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Estado del componente
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
```

### Comportamiento
1. `POST /auth/login` con `{ email, password }`
2. Respuesta: `{ access_token, user: { id, nombre, rol } }`
3. Guardar en localStorage: `pos_token = access_token`, `pos_user = JSON.stringify(user)`
4. Redirigir a `/mesas` con `useNavigate()`
5. Error → mostrar toast rojo

### Endpoint
```
POST /auth/login    body: { email, password }
```

---

## PANTALLA 1 — Lista de Mesas (`pages/Mesas.tsx`)

### Layout
```
┌─────────────────────────────────────────────────┐
│  🍽 ServalPOS          Usuario: Juan  [Salir]    │
├─────────────────────────────────────────────────┤
│  [Interior]  [Terraza]  [Barra]                 │  ← tabs de zonas
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │  M1  │  │  M2  │  │  M3  │  │  M4  │       │
│  │LIBRE │  │OCUP. │  │LIBRE │  │P.COBR│       │
│  └──────┘  └──────┘  └──────┘  └──────┘       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Estado del componente
```typescript
const [zonas, setZonas] = useState<Zona[]>([]);
const [mesas, setMesas] = useState<Mesa[]>([]);
const [zonaActiva, setZonaActiva] = useState<number | null>(null);
const navigate = useNavigate();
```

### Comportamiento
1. Al montar: `GET /zonas` y `GET /mesas` en paralelo (`Promise.all`)
2. Setear `zonaActiva` con el `id` de la primera zona
3. Filtrar `mesas` por `zona_id === zonaActiva` para mostrar la tab activa
4. Polling cada 15 segundos: usar hook `usePolling(cargarMesas, 15000)`
5. Al tocar mesa **libre** → abrir modal de comensales (picker 1–12), al confirmar → `POST /ordenes` con `num_comensales` y navegar a `/tpv/:nuevaOrdenId`
6. Al tocar mesa **ocupada** → `GET /ordenes?mesa_id=X&estado=abierta`, tomar `data[0].id`, navegar a `/tpv/:ordenId`
7. Al tocar mesa **por_cobrar** → misma lógica que ocupada pero navegar a `/cobro/:ordenId`
8. Botón [Salir] → borra localStorage, navega a `/`

### Colores de mesa
```typescript
const COLORES_MESA: Record<MesaEstado, { bg: string; color: string }> = {
  libre:      { bg: '#2ecc71', color: '#fff' },
  ocupada:    { bg: '#e74c3c', color: '#fff' },
  por_cobrar: { bg: '#f39c12', color: '#000' },
  reservada:  { bg: '#3498db', color: '#fff' },
  bloqueada:  { bg: '#7f8c8d', color: '#fff' },
};
```

### Componente MesaCard
```tsx
// components/MesaCard.tsx
interface Props { mesa: Mesa; onClick: () => void; }
export function MesaCard({ mesa, onClick }: Props) {
  const { bg, color } = COLORES_MESA[mesa.estado];
  return (
    <button onClick={onClick} style={{ background: bg, color }}
      className="mesa-card">
      <span className="mesa-nombre">{mesa.nombre}</span>
      <span className="mesa-estado">{mesa.estado.toUpperCase()}</span>
    </button>
  );
}
```

### Endpoints
```
GET  /zonas
GET  /mesas
GET  /ordenes?mesa_id={id}&estado=abierta
POST /ordenes    body: { mesa_id, sucursal_id, usuario_id, tipo_servicio: "mesa", num_comensales }
```

---

## PANTALLA 2 — TPV (`pages/TPV.tsx`)

### Layout
```
┌──────────────────────────────┬─────────────────────────┐
│ ← Volver    Mesa 5           │  ORDEN #0042             │
├──────────────────────────────┤  Mesa 5 — Juan           │
│ [Carnes] [Bebidas] [Postres] │─────────────────────────│
│ [Entradas] [Especiales]      │  1x Churrasco    $850   │
├──────────────────────────────┤     └─ Poco hecho        │
│  ┌────────┐  ┌────────┐      │  2x Coca Cola    $200   │
│  │Churras.│  │ Lomo   │      │─────────────────────────│
│  │ $850   │  │ $950   │      │  Subtotal       $1,400  │
│  └────────┘  └────────┘      │  ITBIS 18%      $  252  │
│                              │  Propina 10%    $  140  │
│                              │─────────────────────────│
│                              │  TOTAL         $1,792   │
│                              │  [🍳 Enviar cocina]     │
│                              │  [💳 Cobrar]            │
└──────────────────────────────┴─────────────────────────┘
```

### Props / parámetros de ruta
```typescript
const { ordenId } = useParams<{ ordenId: string }>();
```

### Estado del componente
```typescript
const [orden, setOrden] = useState<Orden | null>(null);
const [lineas, setLineas] = useState<OrdenLinea[]>([]);
const [familias, setFamilias] = useState<Familia[]>([]);
const [familiaActiva, setFamiliaActiva] = useState<number | null>(null);
const [articulos, setArticulos] = useState<Articulo[]>([]);
const [modalArticulo, setModalArticulo] = useState<Articulo | null>(null); // artículo pendiente de modificadores
const [lineaSeleccionada, setLineaSeleccionada] = useState<OrdenLinea | null>(null);
```

### Comportamiento — columna izquierda
1. Al montar: `GET /familias?estado=activo` → setear primera familia como activa
2. Al cambiar familia: `GET /articulos?familia_id={id}&estado=activo`
3. Al tocar artículo:
   - `GET /grupos-modificadores?articulo_id={id}` 
   - Si hay grupos con `obligatorio: true` → abrir `<ModificadoresModal>`
   - Si no → `POST /orden-lineas` directamente y refrescar orden

### Comportamiento — columna derecha
1. Al montar: `GET /ordenes/{id}` y `GET /orden-lineas?orden_id={id}`
2. Al tocar una línea → mostrar panel inline con +/−/🗑
3. `[Enviar cocina]` → `PATCH /orden-lineas/{id}` con `{ estado: "en_preparacion", enviado_a_cocina: true }` para cada línea pendiente
4. `[Cobrar]` → `navigate('/cobro/' + ordenId)`
5. `[Nota]` → input de texto inline, guarda con `PATCH /ordenes/{id}` body `{ notas }`

### Componente ModificadoresModal
```tsx
// components/ModificadoresModal.tsx
interface Props {
  articulo: Articulo;
  onConfirm: (modificadoresSeleccionados: { modificador_id: number; precio_extra: number }[]) => void;
  onClose: () => void;
}
```
- Carga `GET /grupos-modificadores?articulo_id={id}` y por cada grupo `GET /modificadores?grupo_modificador_id={id}`
- Grupos `seleccion: 'unica'` → botones radio táctiles grandes
- Grupos `seleccion: 'multiple'` → checkboxes táctiles grandes
- Grupos `obligatorio: true` → marcados con `*` rojo
- Botón "Agregar" deshabilitado hasta que todos los grupos obligatorios tengan selección
- Al confirmar: `POST /orden-lineas` → luego `POST /orden-linea-modificadores` por cada modificador seleccionado

### Totales (calculados en el frontend)
```typescript
const subtotal = lineas.reduce((s, l) => s + Number(l.subtotal_linea), 0);
// Los impuestos y total vienen del objeto `orden` (calculados en backend)
```

### Endpoints
```
GET    /familias?estado=activo
GET    /articulos?familia_id={id}&estado=activo
GET    /grupos-modificadores?articulo_id={id}
GET    /modificadores?grupo_modificador_id={id}
GET    /ordenes/{id}
GET    /orden-lineas?orden_id={id}
POST   /orden-lineas           body: { orden_id, articulo_id, cantidad, precio_unitario, subtotal_linea }
POST   /orden-linea-modificadores  body: { orden_linea_id, modificador_id, precio_extra }
PATCH  /orden-lineas/{id}      body: { cantidad } | { estado: "cancelada" } | { estado: "en_preparacion", enviado_a_cocina: true }
PATCH  /ordenes/{id}           body: { notas }
```

---

## PANTALLA 3 — Cobro (`pages/Cobro.tsx`)

### Layout
```
┌─────────────────────────────────────────────────┐
│ ← Volver              COBRO — Mesa 5            │
├──────────────────────┬──────────────────────────┤
│  RESUMEN DE ORDEN    │  FORMAS DE PAGO           │
│  1x Churrasco $850   │  [Efectivo]  [Tarjeta]   │
│  2x Coca Cola $200   │  [Transfer.] [Otro]       │
│  ─────────────────── │                           │
│  Subtotal    $1,400  │  Monto: [  $1,792.00   ] │
│  ITBIS 18%   $  252  │                           │
│  Propina 10% $  140  │  ┌──────────────────────┐│
│  TOTAL      $1,792   │  │ Efectivo    $1,792   ││
│                      │  └──────────────────────┘│
│                      │  Pagado:     $1,792.00    │
│                      │  Cambio:     $    0.00    │
│                      │  [✅ CONFIRMAR COBRO]     │
└──────────────────────┴──────────────────────────┘
```

### Props / parámetros de ruta
```typescript
const { ordenId } = useParams<{ ordenId: string }>();
```

### Estado del componente
```typescript
const [orden, setOrden] = useState<Orden | null>(null);
const [lineas, setLineas] = useState<OrdenLinea[]>([]);
const [formasPago, setFormasPago] = useState<FormaPago[]>([]);
const [formaSeleccionada, setFormaSeleccionada] = useState<FormaPago | null>(null);
const [montoPago, setMontoPago] = useState<string>('');
const [pagos, setPagos] = useState<{ forma_pago_id: number; nombre: string; monto: number }[]>([]);
const [confirmando, setConfirmando] = useState(false);
const navigate = useNavigate();
```

### Comportamiento
1. Al montar: `GET /ordenes/{id}`, `GET /orden-lineas?orden_id={id}`, `GET /formas-pago?estado=activo` en paralelo
2. Al cargar orden: `setMontoPago(orden.total.toString())`

**Agregar pago:**
- Validar `formaSeleccionada !== null` y `parseFloat(montoPago) > 0`
- Añadir a array `pagos` local
- Recalcular `totalPagado` y `cambio`

**Totales dinámicos:**
```typescript
const totalPagado = pagos.reduce((s, p) => s + p.monto, 0);
const pendiente = (orden?.total ?? 0) - totalPagado;
const cambio = Math.max(0, totalPagado - (orden?.total ?? 0));
```

**Confirmar cobro (botón deshabilitado si `pendiente > 0`):**
1. Para cada pago en array: `POST /orden-pagos` body `{ orden_id, forma_pago_id, monto }`
2. `PATCH /ordenes/{id}` body `{ estado: "cobrada", fecha_cierre: new Date().toISOString() }`
3. `PATCH /mesas/{id}` body `{ estado: "libre" }` (usar `orden.mesa_id`)
4. Si `cambio > 0` → mostrar modal de cambio antes de redirigir
5. `navigate('/mesas')`

**Modal de cambio:**
- Overlay simple: "Cambio a devolver: $XXX"
- Botón "Cerrar y finalizar" → ejecuta pasos 2-5

### Endpoints
```
GET    /ordenes/{id}
GET    /orden-lineas?orden_id={id}
GET    /formas-pago?estado=activo
POST   /orden-pagos       body: { orden_id, forma_pago_id, monto, referencia? }
PATCH  /ordenes/{id}      body: { estado: "cobrada", fecha_cierre: ISO_string }
PATCH  /mesas/{id}        body: { estado: "libre" }
```

---

## hooks/useToast.ts

```typescript
import { useState, useCallback } from 'react';

export type ToastType = 'error' | 'success';

export function useToast() {
  const [toast, setToast] = useState<{ mensaje: string; tipo: ToastType } | null>(null);

  const showToast = useCallback((mensaje: string, tipo: ToastType = 'error') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
}
```

### Componente Toast
```tsx
// components/Toast.tsx
interface Props { mensaje: string; tipo: 'error' | 'success'; }
export function Toast({ mensaje, tipo }: Props) {
  return (
    <div className={`toast toast-${tipo}`}>{mensaje}</div>
  );
}
// CSS: posición fixed bottom, fondo rojo (#e74c3c) o verde (#2ecc71), 3s de fade-out
```

---

## hooks/usePolling.ts

```typescript
import { useEffect, useRef } from 'react';

export function usePolling(callback: () => void, intervalMs: number) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
```

---

## pos.css — Variables y clases base

```css
:root {
  --bg: #1a1a2e;
  --surface: #16213e;
  --accent: #e94560;
  --text: #eaeaea;
  --text-muted: #8899aa;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--text); font-family: system-ui, sans-serif; }

/* Botones táctiles */
.btn { min-height: 48px; min-width: 48px; padding: 12px 20px; border: none;
       border-radius: 8px; font-size: 1rem; cursor: pointer; font-weight: 600; }
.btn-primary { background: var(--accent); color: #fff; }
.btn-secondary { background: var(--surface); color: var(--text); border: 1px solid #334; }

/* Cards de mesa */
.mesa-card { width: 90px; height: 90px; border-radius: 12px; border: none;
             display: flex; flex-direction: column; align-items: center;
             justify-content: center; cursor: pointer; font-weight: 700; gap: 4px; }

/* Layout TPV y Cobro */
.layout-split { display: grid; grid-template-columns: 1fr 380px; height: 100vh; }

/* Tabs de familia/zona */
.tabs { display: flex; gap: 8px; overflow-x: auto; padding: 8px;
        background: var(--surface); }
.tab { padding: 10px 16px; border-radius: 20px; border: none; cursor: pointer;
       background: #334; color: var(--text); white-space: nowrap; font-size: 0.9rem; }
.tab.active { background: var(--accent); color: #fff; }

/* Grid artículos */
.articulos-grid { display: grid; grid-template-columns: repeat(3, 1fr);
                  gap: 12px; padding: 12px; overflow-y: auto; }

/* Toast */
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
         padding: 12px 24px; border-radius: 8px; font-weight: 600; z-index: 9999; }
.toast-error   { background: #e74c3c; color: #fff; }
.toast-success { background: #2ecc71; color: #000; }
```

---

## Notas de implementación

### Autenticación
- Token: `localStorage.getItem('pos_token')`
- Usuario: `JSON.parse(localStorage.getItem('pos_user') ?? '{}')`
- Cualquier 401 → redirigir a `/` (manejado en `api.ts`)

### Manejo de errores
- **No usar** `alert()` ni `confirm()` del navegador
- Usar el hook `useToast` en cada página y pasar `showToast` a los event handlers
- Envolver cada llamada a `api()` en `try/catch`

### Setup del proyecto
```bash
npm create vite@latest pos-frontend -- --template react-ts
cd pos-frontend
npm install react-router-dom
npm run dev
```

### Variables de entorno (opcional)
```env
# .env
VITE_API_URL=http://localhost:4809
```
Y en `api.ts`: `const API_URL = import.meta.env.VITE_API_URL`

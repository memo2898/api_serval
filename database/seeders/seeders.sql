-- =============================================================
-- SEEDERS — Catálogos principales
-- Sistema POS Restaurantes
-- =============================================================

-- =============================================================
-- TIPOS DE DOCUMENTO
-- =============================================================

INSERT INTO tipo_documentos (tipo, aplica_a, tipo_validacion, regex_validacion, funcion_validacion, formato_ejemplo) VALUES
-- República Dominicana
('RNC',
 'persona_juridica',
 'ninguna',
 NULL,
 NULL,
 '0-00-00000-0'),

('Cédula',
 'persona_fisica',
 'ambos',
 '^[\d\-\s]{11,13}$',
 '(valor) => { const d = valor.replace(/[-\s]/g, ""); if (!/^\d{11}$/.test(d)) return false; const w = [1,2,1,2,1,2,1,2,1,2]; let s = 0; for (let i = 0; i < 10; i++) { let v = parseInt(d[i]) * w[i]; if (v >= 10) v -= 9; s += v; } return ((10 - (s % 10)) % 10) === parseInt(d[10]); }',
 '000-0000000-0'),

('Pasaporte',
 'ambos',
 'ninguna',
 NULL,
 NULL,
 'AA000000'),

-- Internacional
('NIT',       'persona_juridica', 'ninguna', NULL, NULL, NULL),
('DNI',       'persona_fisica',   'ninguna', NULL, NULL, NULL),
('RIF',       'persona_juridica', 'ninguna', NULL, NULL, NULL),
('RFC',       'persona_juridica', 'ninguna', NULL, NULL, NULL),
('Otro',      'ambos',            'ninguna', NULL, NULL, NULL);


-- =============================================================
-- MONEDAS
-- =============================================================

INSERT INTO monedas (codigo, nombre, simbolo, decimales) VALUES
('DOP', 'Peso Dominicano',    'RD$', 2),
('USD', 'Dólar',              '$',   2),
('EUR', 'Euro',               '€',   2),
('MXN', 'Peso Mexicano',      '$',   2),
('COP', 'Peso Colombiano',    '$',   0),
('VES', 'Bolívar Venezolano', 'Bs.', 2),
('PAB', 'Balboa Panameño',    'B/.', 2),
('CRC', 'Colón Costarricense','₡',   2),
('GTQ', 'Quetzal Guatemalteco','Q',  2);


-- =============================================================
-- PAÍSES
-- =============================================================

INSERT INTO paises (nombre, codigo_iso, moneda_id) VALUES
('República Dominicana', 'DO', (SELECT id FROM monedas WHERE codigo = 'DOP')),
('Estados Unidos',       'US', (SELECT id FROM monedas WHERE codigo = 'USD')),
('España',               'ES', (SELECT id FROM monedas WHERE codigo = 'EUR')),
('México',               'MX', (SELECT id FROM monedas WHERE codigo = 'MXN')),
('Colombia',             'CO', (SELECT id FROM monedas WHERE codigo = 'COP')),
('Venezuela',            'VE', (SELECT id FROM monedas WHERE codigo = 'VES')),
('Puerto Rico',          'PR', (SELECT id FROM monedas WHERE codigo = 'USD')),
('Panamá',               'PA', (SELECT id FROM monedas WHERE codigo = 'PAB')),
('Costa Rica',           'CR', (SELECT id FROM monedas WHERE codigo = 'CRC')),
('Guatemala',            'GT', (SELECT id FROM monedas WHERE codigo = 'GTQ'));


-- =============================================================
-- IMPUESTOS
-- =============================================================

-- República Dominicana
INSERT INTO impuestos (pais_id, nombre, porcentaje, tipo, tipo_aplicacion) VALUES
(1, 'ITBIS',   18.00, 'general',    'sobre_precio'),
(1, 'Propina', 10.00, 'especifico', 'sobre_precio');

-- Estados Unidos
INSERT INTO impuestos (pais_id, nombre, porcentaje, tipo, tipo_aplicacion) VALUES
(2, 'Sales Tax', 8.00, 'general', 'sobre_precio');

-- España
INSERT INTO impuestos (pais_id, nombre, porcentaje, tipo, tipo_aplicacion) VALUES
(3, 'IVA General',  21.00, 'general',    'sobre_precio'),
(3, 'IVA Reducido', 10.00, 'especifico', 'sobre_precio');

-- México
INSERT INTO impuestos (pais_id, nombre, porcentaje, tipo, tipo_aplicacion) VALUES
(4, 'IVA', 16.00, 'general', 'sobre_precio');

-- Colombia
INSERT INTO impuestos (pais_id, nombre, porcentaje, tipo, tipo_aplicacion) VALUES
(5, 'IVA',       19.00, 'general',    'sobre_precio'),
(5, 'Propina',    8.00, 'especifico', 'sobre_precio');


-- =============================================================
-- ROLES
-- =============================================================

INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Acceso total al sistema: configuración, reportes y operaciones'),
('Encargado',     'Gestión operativa: puede aplicar descuentos, ver reportes y gestionar turnos'),
('Camarero',      'Toma de órdenes, cobro y gestión de mesas en su turno'),
('Cocinero',      'Acceso a pantalla KDS: ver y actualizar estado de comandas'),
('Cajero',        'Gestión de pagos, cierres de caja y facturación'),
('Bartender',     'Preparación de bebidas y gestión de comandas de bar');


-- Cajero → pagos
-- Bartender → bebidas


-- =============================================================
-- PERMISOS
-- =============================================================

INSERT INTO permisos (codigo, descripcion) VALUES
-- Empresa y configuración
('empresa.ver',               'Ver datos de la empresa'),
('empresa.editar',            'Editar datos de la empresa'),
('sucursal.ver',              'Ver sucursales'),
('sucursal.gestionar',        'Crear y editar sucursales'),
('configuracion.ver',         'Ver configuración del sistema'),
('configuracion.editar',      'Editar configuración del sistema'),

-- Usuarios
('usuarios.ver',              'Ver listado de usuarios'),
('usuarios.crear',            'Crear nuevos usuarios'),
('usuarios.editar',           'Editar usuarios'),
('usuarios.desactivar',       'Desactivar usuarios'),

-- Catálogo
('articulos.ver',             'Ver artículos y familias'),
('articulos.crear',           'Crear artículos'),
('articulos.editar',          'Editar artículos'),
('articulos.eliminar',        'Eliminar o desactivar artículos'),
('familias.gestionar',        'Crear y editar familias y subfamilias'),
('modificadores.gestionar',   'Gestionar grupos de modificadores'),

-- Mesas
('mesas.ver',                 'Ver plano de mesas'),
('mesas.gestionar',           'Crear y editar mesas y zonas'),
('mesas.bloquear',            'Bloquear y desbloquear mesas'),

-- Órdenes
('ordenes.crear',             'Crear nuevas órdenes'),
('ordenes.editar',            'Editar líneas de una orden abierta'),
('ordenes.cancelar_linea',    'Cancelar una línea de orden'),
('ordenes.cancelar',          'Cancelar una orden completa'),
('ordenes.anular',            'Anular una orden ya cobrada'),
('ordenes.ver_todas',         'Ver órdenes de otros usuarios'),
('ordenes.enviar_cocina',     'Enviar comanda a cocina/barra'),

-- Cobro y caja
('cobro.realizar',            'Cobrar órdenes'),
('descuentos.aplicar',        'Aplicar descuentos a órdenes o líneas'),
('descuentos.aplicar_altos',  'Aplicar descuentos que requieren autorización'),
('caja.abrir',                'Abrir turno de caja'),
('caja.cerrar',               'Cerrar turno de caja'),
('caja.movimientos',          'Registrar entradas y salidas de caja'),
('caja.ver_reportes',         'Ver reporte de cierre de caja'),

-- Cocina / KDS
('kds.ver',                   'Ver pantalla KDS de cocina o barra'),
('kds.actualizar_estado',     'Marcar comandas como listas en el KDS'),

-- Reportes
('reportes.ventas',           'Ver reportes de ventas'),
('reportes.articulos',        'Ver reporte de artículos más vendidos'),
('reportes.caja',             'Ver reportes de caja y turnos'),
('reportes.stock',            'Ver reportes de inventario'),

-- Stock
('stock.ver',                 'Ver niveles de inventario'),
('stock.ajustar',             'Registrar ajustes de inventario');


-- =============================================================
-- ASIGNACIÓN DE PERMISOS POR ROL
-- =============================================================

-- Administrador: todos los permisos
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 1, id FROM permisos;

-- Encargado
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 2, id FROM permisos WHERE codigo IN (
    'articulos.ver',
    'articulos.crear',
    'articulos.editar',
    'familias.gestionar',
    'modificadores.gestionar',
    'mesas.ver',
    'mesas.gestionar',
    'mesas.bloquear',
    'ordenes.crear',
    'ordenes.editar',
    'ordenes.cancelar_linea',
    'ordenes.cancelar',
    'ordenes.ver_todas',
    'ordenes.enviar_cocina',
    'cobro.realizar',
    'descuentos.aplicar',
    'descuentos.aplicar_altos',
    'caja.abrir',
    'caja.cerrar',
    'caja.movimientos',
    'caja.ver_reportes',
    'kds.ver',
    'kds.actualizar_estado',
    'reportes.ventas',
    'reportes.articulos',
    'reportes.caja',
    'stock.ver',
    'usuarios.ver'
);

-- Vendedor
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 3, id FROM permisos WHERE codigo IN (
    'articulos.ver',
    'mesas.ver',
    'ordenes.crear',
    'ordenes.editar',
    'ordenes.cancelar_linea',
    'ordenes.enviar_cocina',
    'cobro.realizar',
    'descuentos.aplicar',
    'caja.abrir',
    'caja.cerrar',
    'caja.movimientos',
    'kds.ver'
);

-- Cocinero
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 4, id FROM permisos WHERE codigo IN (
    'kds.ver',
    'kds.actualizar_estado'
);


-- =============================================================
-- USUARIO ADMINISTRADOR POR DEFECTO
-- PIN: 1234  →  cambiar después del primer acceso
-- =============================================================

INSERT INTO usuarios (sucursal_id, nombre, apellido, username, pin, estado) VALUES
-- id=1  Un solo rol
(NULL, 'Administrador', 'Sistema',   'admin',      '1234', 'activo'),
-- id=2  Un solo rol
(NULL, 'Carlos',        'Pérez',     'encargado',  '2345', 'activo'),
-- id=3  Un solo rol
(NULL, 'María',         'López',     'camarero',   '3456', 'activo'),
-- id=4  Un solo rol
(NULL, 'Luis',          'Gómez',     'cocinero',   '4567', 'activo'),
-- id=5  Un solo rol
(NULL, 'Ana',           'Martínez',  'cajero',     '5678', 'activo'),
-- id=6  Un solo rol
(NULL, 'Pedro',         'Ramírez',   'bartender',  '6789', 'activo'),
-- id=7  Camarero que también cobra (Camarero + Cajero)
(NULL, 'Sofia',         'Torres',    'sofia',      '7890', 'activo'),
-- id=8  Bartender que también cocina (Bartender + Cocinero)
(NULL, 'Diego',         'Herrera',   'diego',      '8901', 'activo'),
-- id=9  Encargado de turno que cubre caja (Encargado + Cajero)
(NULL, 'Laura',         'Castillo',  'laura',      '9012', 'activo'),
-- id=10 Dueño con acceso total (Administrador + Encargado)
(NULL, 'Roberto',       'Núñez',     'roberto',    '0123', 'activo');

-- =============================================================
-- ASIGNACIÓN DE ROLES POR USUARIO
-- =============================================================

INSERT INTO usuario_rol (usuario_id, rol_id) VALUES
-- Usuarios con un solo rol
(1,  1),  -- admin      → Administrador
(2,  2),  -- encargado  → Encargado
(3,  3),  -- camarero   → Camarero
(4,  4),  -- cocinero   → Cocinero
(5,  5),  -- cajero     → Cajero
(6,  6),  -- bartender  → Bartender
-- Usuarios con múltiples roles
(7,  3),  -- sofia      → Camarero
(7,  5),  -- sofia      → Cajero
(8,  6),  -- diego      → Bartender
(8,  4),  -- diego      → Cocinero
(9,  2),  -- laura      → Encargado
(9,  5),  -- laura      → Cajero
(10, 1),  -- roberto    → Administrador
(10, 2);  -- roberto    → Encargado


-- =============================================================
-- ALÉRGENOS (14 alérgenos oficiales según Reglamento UE 1169/2011)
-- =============================================================

INSERT INTO alergenos (nombre, icono) VALUES
('Gluten',              'alergeno-gluten.svg'),
('Crustáceos',          'alergeno-crustaceos.svg'),
('Huevos',              'alergeno-huevos.svg'),
('Pescado',             'alergeno-pescado.svg'),
('Cacahuetes',          'alergeno-cacahuetes.svg'),
('Soja',                'alergeno-soja.svg'),
('Lácteos',             'alergeno-lacteos.svg'),
('Frutos de cáscara',   'alergeno-frutos-cascara.svg'),
('Apio',                'alergeno-apio.svg'),
('Mostaza',             'alergeno-mostaza.svg'),
('Sésamo',              'alergeno-sesamo.svg'),
('Dióxido de azufre',   'alergeno-sulfitos.svg'),
('Altramuces',          'alergeno-altramuces.svg'),
('Moluscos',            'alergeno-moluscos.svg');

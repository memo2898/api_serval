-- =============================================================
-- SEEDERS — Catálogos principales
-- Sistema POS Restaurantes
-- Idempotente: seguro de correr varias veces
-- =============================================================


-- =============================================================
-- TIPOS DE DOCUMENTO
-- =============================================================

INSERT INTO tipo_documentos (tipo, aplica_a, tipo_validacion, regex_validacion, funcion_validacion, formato_ejemplo)
SELECT * FROM (VALUES
    ('RNC',
     'persona_juridica',
     'ninguna',
     NULL::TEXT,
     NULL::TEXT,
     '0-00-00000-0'),

    ('Cédula',
     'persona_fisica',
     'ambos',
     '^[\d\-\s]{11,13}$',
     '(valor) => { const d = valor.replace(/[-\s]/g, ""); if (!/^\d{11}$/.test(d)) return false; const w = [1,2,1,2,1,2,1,2,1,2]; let s = 0; for (let i = 0; i < 10; i++) { let v = parseInt(d[i]) * w[i]; if (v >= 10) v -= 9; s += v; } return ((10 - (s % 10)) % 10) === parseInt(d[10]); }',
     '000-0000000-0'),

    ('Pasaporte', 'ambos',            'ninguna', NULL, NULL, 'AA000000'),
    ('NIT',       'persona_juridica', 'ninguna', NULL, NULL, NULL),
    ('DNI',       'persona_fisica',   'ninguna', NULL, NULL, NULL),
    ('RIF',       'persona_juridica', 'ninguna', NULL, NULL, NULL),
    ('RFC',       'persona_juridica', 'ninguna', NULL, NULL, NULL),
    ('Otro',      'ambos',            'ninguna', NULL, NULL, NULL)
) AS v(tipo, aplica_a, tipo_validacion, regex_validacion, funcion_validacion, formato_ejemplo)
WHERE NOT EXISTS (
    SELECT 1 FROM tipo_documentos WHERE tipo = v.tipo LIMIT 1
);


-- =============================================================
-- MONEDAS  (UNIQUE en codigo → ON CONFLICT es suficiente)
-- =============================================================

INSERT INTO monedas (codigo, nombre, simbolo, decimales) VALUES
('DOP', 'Peso Dominicano',     'RD$', 2),
('USD', 'Dólar',               '$',   2),
('EUR', 'Euro',                '€',   2),
('MXN', 'Peso Mexicano',       '$',   2),
('COP', 'Peso Colombiano',     '$',   0),
('VES', 'Bolívar Venezolano',  'Bs.', 2),
('PAB', 'Balboa Panameño',     'B/.', 2),
('CRC', 'Colón Costarricense', '₡',   2),
('GTQ', 'Quetzal Guatemalteco','Q',   2)
ON CONFLICT (codigo) DO NOTHING;


-- =============================================================
-- PAÍSES  (UNIQUE en codigo_iso)
-- =============================================================

INSERT INTO paises (nombre, codigo_iso, moneda_id) VALUES
('República Dominicana', 'DO', (SELECT id FROM monedas WHERE codigo = 'DOP' LIMIT 1)),
('Estados Unidos',       'US', (SELECT id FROM monedas WHERE codigo = 'USD' LIMIT 1)),
('España',               'ES', (SELECT id FROM monedas WHERE codigo = 'EUR' LIMIT 1)),
('México',               'MX', (SELECT id FROM monedas WHERE codigo = 'MXN' LIMIT 1)),
('Colombia',             'CO', (SELECT id FROM monedas WHERE codigo = 'COP' LIMIT 1)),
('Venezuela',            'VE', (SELECT id FROM monedas WHERE codigo = 'VES' LIMIT 1)),
('Puerto Rico',          'PR', (SELECT id FROM monedas WHERE codigo = 'USD' LIMIT 1)),
('Panamá',               'PA', (SELECT id FROM monedas WHERE codigo = 'PAB' LIMIT 1)),
('Costa Rica',           'CR', (SELECT id FROM monedas WHERE codigo = 'CRC' LIMIT 1)),
('Guatemala',            'GT', (SELECT id FROM monedas WHERE codigo = 'GTQ' LIMIT 1))
ON CONFLICT (codigo_iso) DO NOTHING;


-- =============================================================
-- IMPUESTOS
-- =============================================================

INSERT INTO impuestos (pais_id, nombre, porcentaje, tipo, tipo_aplicacion)
SELECT p.id, v.nombre, v.porcentaje, v.tipo, v.tipo_aplicacion
FROM (VALUES
    ('DO', 'ITBIS',        18.00, 'general',    'sobre_precio'),
    ('DO', 'Propina',      10.00, 'especifico', 'sobre_precio'),
    ('US', 'Sales Tax',     8.00, 'general',    'sobre_precio'),
    ('ES', 'IVA General',  21.00, 'general',    'sobre_precio'),
    ('ES', 'IVA Reducido', 10.00, 'especifico', 'sobre_precio'),
    ('MX', 'IVA',          16.00, 'general',    'sobre_precio'),
    ('CO', 'IVA',          19.00, 'general',    'sobre_precio'),
    ('CO', 'Propina',       8.00, 'especifico', 'sobre_precio')
) AS v(codigo_iso, nombre, porcentaje, tipo, tipo_aplicacion)
JOIN paises p ON p.codigo_iso = v.codigo_iso
WHERE NOT EXISTS (
    SELECT 1 FROM impuestos i
    WHERE i.pais_id = p.id AND i.nombre = v.nombre
    LIMIT 1
);


-- =============================================================
-- ROLES  (UNIQUE en nombre)
-- =============================================================

INSERT INTO roles (nombre, descripcion, icono) VALUES
('Administrador', 'Acceso total al sistema: configuración, reportes y operaciones', 'fa-user-shield'),
('Encargado',     'Gestión operativa: puede aplicar descuentos, ver reportes y gestionar turnos', 'fa-user-tie'),
('Camarero',      'Toma de órdenes, cobro y gestión de mesas en su turno', 'fa-utensils'),
('Cocinero',      'Acceso a pantalla KDS: ver y actualizar estado de comandas', 'fa-fire'),
('Cajero',        'Gestión de pagos, cierres de caja y facturación', 'fa-cash-register'),
('Bartender',     'Preparación de bebidas y gestión de comandas de bar', 'fa-martini-glass')
ON CONFLICT (nombre) DO NOTHING;


-- =============================================================
-- PERMISOS  (UNIQUE en codigo)
-- =============================================================

INSERT INTO permisos (codigo, descripcion) VALUES
('empresa.ver',               'Ver datos de la empresa'),
('empresa.editar',            'Editar datos de la empresa'),
('sucursal.ver',              'Ver sucursales'),
('sucursal.gestionar',        'Crear y editar sucursales'),
('configuracion.ver',         'Ver configuración del sistema'),
('configuracion.editar',      'Editar configuración del sistema'),
('usuarios.ver',              'Ver listado de usuarios'),
('usuarios.crear',            'Crear nuevos usuarios'),
('usuarios.editar',           'Editar usuarios'),
('usuarios.desactivar',       'Desactivar usuarios'),
('articulos.ver',             'Ver artículos y familias'),
('articulos.crear',           'Crear artículos'),
('articulos.editar',          'Editar artículos'),
('articulos.eliminar',        'Eliminar o desactivar artículos'),
('familias.gestionar',        'Crear y editar familias y subfamilias'),
('modificadores.gestionar',   'Gestionar grupos de modificadores'),
('mesas.ver',                 'Ver plano de mesas'),
('mesas.gestionar',           'Crear y editar mesas y zonas'),
('mesas.bloquear',            'Bloquear y desbloquear mesas'),
('ordenes.crear',             'Crear nuevas órdenes'),
('ordenes.editar',            'Editar líneas de una orden abierta'),
('ordenes.cancelar_linea',    'Cancelar una línea de orden'),
('ordenes.cancelar',          'Cancelar una orden completa'),
('ordenes.anular',            'Anular una orden ya cobrada'),
('ordenes.ver_todas',         'Ver órdenes de otros usuarios'),
('ordenes.enviar_cocina',     'Enviar comanda a cocina/barra'),
('cobro.realizar',            'Cobrar órdenes'),
('descuentos.aplicar',        'Aplicar descuentos a órdenes o líneas'),
('descuentos.aplicar_altos',  'Aplicar descuentos que requieren autorización'),
('caja.abrir',                'Abrir turno de caja'),
('caja.cerrar',               'Cerrar turno de caja'),
('caja.movimientos',          'Registrar entradas y salidas de caja'),
('caja.ver_reportes',         'Ver reporte de cierre de caja'),
('kds.ver',                   'Ver pantalla KDS de cocina o barra'),
('kds.actualizar_estado',     'Marcar comandas como listas en el KDS'),
('reportes.ventas',           'Ver reportes de ventas'),
('reportes.articulos',        'Ver reporte de artículos más vendidos'),
('reportes.caja',             'Ver reportes de caja y turnos'),
('reportes.stock',            'Ver reportes de inventario'),
('stock.ver',                 'Ver niveles de inventario'),
('stock.ajustar',             'Registrar ajustes de inventario')
ON CONFLICT (codigo) DO NOTHING;


-- =============================================================
-- ASIGNACIÓN DE PERMISOS POR ROL  (PK compuesta)
-- =============================================================

-- Administrador: todos los permisos
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT (SELECT id FROM roles WHERE nombre = 'Administrador' LIMIT 1), id FROM permisos
ON CONFLICT DO NOTHING;

-- Encargado
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT (SELECT id FROM roles WHERE nombre = 'Encargado' LIMIT 1), id
FROM permisos WHERE codigo IN (
    'articulos.ver', 'articulos.crear', 'articulos.editar',
    'familias.gestionar', 'modificadores.gestionar',
    'mesas.ver', 'mesas.gestionar', 'mesas.bloquear',
    'ordenes.crear', 'ordenes.editar', 'ordenes.cancelar_linea',
    'ordenes.cancelar', 'ordenes.ver_todas', 'ordenes.enviar_cocina',
    'cobro.realizar', 'descuentos.aplicar', 'descuentos.aplicar_altos',
    'caja.abrir', 'caja.cerrar', 'caja.movimientos', 'caja.ver_reportes',
    'kds.ver', 'kds.actualizar_estado',
    'reportes.ventas', 'reportes.articulos', 'reportes.caja',
    'stock.ver', 'usuarios.ver'
)
ON CONFLICT DO NOTHING;

-- Camarero
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT (SELECT id FROM roles WHERE nombre = 'Camarero' LIMIT 1), id
FROM permisos WHERE codigo IN (
    'articulos.ver', 'mesas.ver',
    'ordenes.crear', 'ordenes.editar', 'ordenes.cancelar_linea',
    'ordenes.enviar_cocina', 'cobro.realizar', 'descuentos.aplicar',
    'caja.abrir', 'caja.cerrar', 'caja.movimientos', 'kds.ver'
)
ON CONFLICT DO NOTHING;

-- Cocinero
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT (SELECT id FROM roles WHERE nombre = 'Cocinero' LIMIT 1), id
FROM permisos WHERE codigo IN ('kds.ver', 'kds.actualizar_estado')
ON CONFLICT DO NOTHING;


-- =============================================================
-- USUARIOS  (UNIQUE en username)
-- =============================================================

INSERT INTO usuarios (sucursal_id, nombre, apellido, username, pin, estado) VALUES
(NULL, 'Administrador', 'Sistema',   'admin',      '1234', 'activo'),
(NULL, 'Carlos',        'Pérez',     'encargado',  '1234', 'activo'),
(NULL, 'María',         'López',     'camarero',   '1234', 'activo'),
(NULL, 'Luis',          'Gómez',     'cocinero',   '1234', 'activo'),
(NULL, 'Ana',           'Martínez',  'cajero',     '1234', 'activo'),
(NULL, 'Pedro',         'Ramírez',   'bartender',  '1234', 'activo'),
(NULL, 'Sofia',         'Torres',    'sofia',      '1234', 'activo'),
(NULL, 'Diego',         'Herrera',   'diego',      '1234', 'activo'),
(NULL, 'Laura',         'Castillo',  'laura',      '1234', 'activo'),
(NULL, 'Roberto',       'Núñez',     'roberto',    '1234', 'activo')
ON CONFLICT (username) DO NOTHING;


-- =============================================================
-- ASIGNACIÓN DE ROLES POR USUARIO  (PK compuesta)
-- =============================================================

INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM (VALUES
    ('admin',     'Administrador'),
    ('encargado', 'Encargado'),
    ('camarero',  'Camarero'),
    ('cocinero',  'Cocinero'),
    ('cajero',    'Cajero'),
    ('bartender', 'Bartender'),
    ('sofia',     'Camarero'),
    ('sofia',     'Cajero'),
    ('diego',     'Bartender'),
    ('diego',     'Cocinero'),
    ('laura',     'Encargado'),
    ('laura',     'Cajero'),
    ('roberto',   'Administrador'),
    ('roberto',   'Encargado')
) AS v(username, rol)
JOIN usuarios u ON u.username = v.username
JOIN roles    r ON r.nombre   = v.rol
ON CONFLICT DO NOTHING;


-- =============================================================
-- EMPRESA Y SUCURSAL
-- =============================================================

INSERT INTO empresas (nombre, tipo_documento_id, numero_documento, estado, agregado_por)
SELECT
    'Chuy''s Mexican Grill',
    (SELECT id FROM tipo_documentos WHERE tipo = 'RNC' LIMIT 1),
    '000000',
    'activo',
    (SELECT id FROM usuarios WHERE username = 'admin' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM empresas WHERE nombre = 'Chuy''s Mexican Grill' LIMIT 1
);

INSERT INTO sucursales (empresa_id, nombre, estado, agregado_por)
SELECT
    (SELECT id FROM empresas WHERE nombre = 'Chuy''s Mexican Grill' LIMIT 1),
    'Central',
    'activo',
    (SELECT id FROM usuarios WHERE username = 'admin' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM sucursales WHERE nombre = 'Central' LIMIT 1
);

-- Asignar usuarios sin sucursal a Central
UPDATE usuarios
SET sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
WHERE sucursal_id IS NULL;


-- =============================================================
-- ALÉRGENOS
-- =============================================================

INSERT INTO alergenos (nombre, icono)
SELECT v.nombre, v.icono
FROM (VALUES
    ('Gluten',            'alergeno-gluten.svg'),
    ('Crustáceos',        'alergeno-crustaceos.svg'),
    ('Huevos',            'alergeno-huevos.svg'),
    ('Pescado',           'alergeno-pescado.svg'),
    ('Cacahuetes',        'alergeno-cacahuetes.svg'),
    ('Soja',              'alergeno-soja.svg'),
    ('Lácteos',           'alergeno-lacteos.svg'),
    ('Frutos de cáscara', 'alergeno-frutos-cascara.svg'),
    ('Apio',              'alergeno-apio.svg'),
    ('Mostaza',           'alergeno-mostaza.svg'),
    ('Sésamo',            'alergeno-sesamo.svg'),
    ('Dióxido de azufre', 'alergeno-sulfitos.svg'),
    ('Altramuces',        'alergeno-altramuces.svg'),
    ('Moluscos',          'alergeno-moluscos.svg')
) AS v(nombre, icono)
WHERE NOT EXISTS (
    SELECT 1 FROM alergenos WHERE nombre = v.nombre LIMIT 1
);


-- =============================================================
-- GRUPOS DE MODIFICADORES
-- tipo 'articulo'   → opciones con precio (se suman al total)
-- tipo 'comentario' → texto libre / notas sin precio
-- seleccion 'unica'    → radio button
-- seleccion 'multiple' → checkbox
-- =============================================================

INSERT INTO grupos_modificadores (nombre, tipo, seleccion, obligatorio, min_seleccion, max_seleccion)
SELECT v.nombre, v.tipo, v.seleccion, v.obligatorio, v.min_sel, v.max_sel
FROM (VALUES
    ('Término de cocción',    'articulo',    'unica',    TRUE,  1, 1),
    ('Tamaño de porción',     'articulo',    'unica',    FALSE, 0, 1),
    ('Tipo de pan',           'articulo',    'unica',    FALSE, 0, 1),
    ('Extras / Adicionales',  'articulo',    'multiple', FALSE, 0, 5),
    ('Sin ingredientes',      'articulo',    'multiple', FALSE, 0, 5),
    ('Salsa',                 'articulo',    'multiple', FALSE, 0, 3),
    ('Temperatura de bebida', 'articulo',    'unica',    FALSE, 0, 1),
    ('Tipo de leche',         'articulo',    'unica',    FALSE, 0, 1),
    ('Nivel de azúcar',       'articulo',    'unica',    FALSE, 0, 1),
    ('Notas de cocina',       'comentario',  'unica',    FALSE, 0, 1)
) AS v(nombre, tipo, seleccion, obligatorio, min_sel, max_sel)
WHERE NOT EXISTS (
    SELECT 1 FROM grupos_modificadores WHERE nombre = v.nombre LIMIT 1
);


-- =============================================================
-- MODIFICADORES
-- Referencia grupos por nombre para evitar IDs hardcodeados
-- =============================================================

INSERT INTO modificadores (grupo_modificador_id, nombre, precio_extra, orden_visual)
SELECT g.id, v.nombre, v.precio_extra, v.orden_visual
FROM (VALUES
    -- Término de cocción
    ('Término de cocción', 'Vuelta y vuelta',      0.00, 1),
    ('Término de cocción', 'Poco hecho',           0.00, 2),
    ('Término de cocción', 'Al punto',             0.00, 3),
    ('Término de cocción', 'Tres cuartos',         0.00, 4),
    ('Término de cocción', 'Bien hecho',           0.00, 5),
    -- Tamaño de porción
    ('Tamaño de porción',  'Pequeño',              0.00, 1),
    ('Tamaño de porción',  'Mediano',              0.00, 2),
    ('Tamaño de porción',  'Grande',               1.50, 3),
    ('Tamaño de porción',  'Extra grande',         3.00, 4),
    -- Tipo de pan
    ('Tipo de pan',        'Pan blanco',           0.00, 1),
    ('Tipo de pan',        'Pan integral',         0.00, 2),
    ('Tipo de pan',        'Pan brioche',          0.50, 3),
    ('Tipo de pan',        'Sin pan',              0.00, 4),
    -- Extras / Adicionales
    ('Extras / Adicionales', 'Queso extra',        1.00, 1),
    ('Extras / Adicionales', 'Bacon',              1.50, 2),
    ('Extras / Adicionales', 'Aguacate',           1.00, 3),
    ('Extras / Adicionales', 'Huevo frito',        0.75, 4),
    ('Extras / Adicionales', 'Jalapeños',          0.50, 5),
    ('Extras / Adicionales', 'Cebolla caramelizada', 0.75, 6),
    -- Sin ingredientes
    ('Sin ingredientes',   'Sin cebolla',          0.00, 1),
    ('Sin ingredientes',   'Sin tomate',           0.00, 2),
    ('Sin ingredientes',   'Sin lechuga',          0.00, 3),
    ('Sin ingredientes',   'Sin pepinillo',        0.00, 4),
    ('Sin ingredientes',   'Sin gluten',           0.00, 5),
    -- Salsa
    ('Salsa',              'Kétchup',              0.00, 1),
    ('Salsa',              'Mayonesa',             0.00, 2),
    ('Salsa',              'Mostaza',              0.00, 3),
    ('Salsa',              'Salsa BBQ',            0.00, 4),
    ('Salsa',              'Salsa picante',        0.00, 5),
    ('Salsa',              'Sin salsa',            0.00, 6),
    -- Temperatura de bebida
    ('Temperatura de bebida', 'Frío',              0.00, 1),
    ('Temperatura de bebida', 'Caliente',          0.00, 2),
    ('Temperatura de bebida', 'Temperatura ambiente', 0.00, 3),
    -- Tipo de leche
    ('Tipo de leche',      'Leche entera',         0.00, 1),
    ('Tipo de leche',      'Leche desnatada',      0.00, 2),
    ('Tipo de leche',      'Leche de avena',       0.50, 3),
    ('Tipo de leche',      'Leche de almendra',    0.50, 4),
    ('Tipo de leche',      'Leche de soja',        0.50, 5),
    ('Tipo de leche',      'Sin leche',            0.00, 6),
    -- Nivel de azúcar
    ('Nivel de azúcar',    'Sin azúcar',           0.00, 1),
    ('Nivel de azúcar',    'Poco dulce',           0.00, 2),
    ('Nivel de azúcar',    'Normal',               0.00, 3),
    ('Nivel de azúcar',    'Extra dulce',          0.00, 4)
) AS v(grupo, nombre, precio_extra, orden_visual)
JOIN grupos_modificadores g ON g.nombre = v.grupo
WHERE NOT EXISTS (
    SELECT 1 FROM modificadores m
    WHERE m.grupo_modificador_id = g.id AND m.nombre = v.nombre
    LIMIT 1
);


-- =============================================================
-- FORMAS DE PAGO
-- =============================================================

INSERT INTO formas_pago (sucursal_id, nombre, tipo, requiere_referencia, estado)
SELECT v.sucursal_id, v.nombre, v.tipo, v.requiere_referencia, v.estado
FROM (VALUES
    (NULL::INT, 'Efectivo',               'efectivo',    FALSE, 'activo'),
    (NULL::INT, 'Tarjeta de crédito',     'credito',     TRUE,  'activo'),
    (NULL::INT, 'Transferencia bancaria', 'electronico', TRUE,  'activo')
) AS v(sucursal_id, nombre, tipo, requiere_referencia, estado)
WHERE NOT EXISTS (
    SELECT 1 FROM formas_pago WHERE nombre = v.nombre LIMIT 1
);

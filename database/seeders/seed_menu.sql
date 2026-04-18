-- =============================================================
-- SEED — Menú: Familias, Artículos y Precios
-- Sistema POS Restaurantes
-- Idempotente: seguro de correr varias veces
-- Ejecutar DESPUÉS de seeders.sql
-- =============================================================


-- =============================================================
-- FAMILIAS
-- =============================================================

INSERT INTO familias (sucursal_id, nombre, color, icono, orden_visual, destino_impresion)
SELECT
    (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1),
    v.nombre, v.color, v.icono, v.orden_visual, v.destino_impresion
FROM (VALUES
    ('Cócteles',        '#E91E63', 'fa-martini-glass',   1, 'barra'),
    ('Cervezas',        '#FF9800', 'fa-beer-mug-empty',  2, 'barra'),
    ('Aguas',           '#03A9F4', 'fa-droplet',         3, 'barra'),
    ('Cafés Calientes', '#795548', 'fa-mug-hot',         4, 'cocina'),
    ('Frappés',         '#6D4C41', 'fa-blender',         5, 'barra'),
    ('Refrescos',       '#F44336', 'fa-bottle-water',    6, 'barra'),
    ('Jugos y Sabores', '#4CAF50', 'fa-lemon',           7, 'barra'),
    ('Entradas',        '#FF5722', 'fa-plate-wheat',     8, 'cocina'),
    ('Platos Fuertes',  '#9C27B0', 'fa-utensils',        9, 'cocina'),
    ('Postres',         '#FFC107', 'fa-ice-cream',      10, 'cocina')
) AS v(nombre, color, icono, orden_visual, destino_impresion)
WHERE NOT EXISTS (
    SELECT 1 FROM familias
    WHERE nombre = v.nombre
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
);


-- =============================================================
-- ARTÍCULOS
-- Patrón: INSERT...SELECT con CROSS JOIN a la familia (LIMIT 1)
-- y WHERE NOT EXISTS para idempotencia.
-- =============================================================

-- Cócteles
INSERT INTO articulos (familia_id, nombre, precio_venta)
SELECT f.id, v.nombre, v.precio
FROM (VALUES
    ('Cuba Libre',               300.00),
    ('Whiskey Sour',             400.00),
    ('Ron Sour',                 400.00),
    ('Vodka Tonic',              425.00),
    ('Gin Tonic Especiado',      425.00),
    ('Gin Tonic Cítrico',        425.00),
    ('Gin Tonic Afrutado',       425.00),
    ('Moscow Mule',              400.00),
    ('Margarita Clásica',        450.00),
    ('Margarita de Chinola',     450.00),
    ('Margarita de Fresa',       450.00),
    ('Margarita de Coco',        450.00),
    ('Screwdriver',              360.00),
    ('Sex on the Beach',         395.00),
    ('Sangría',                  390.00),
    ('Long Island Tradicional',  495.00),
    ('Long Island Ice Tea',      495.00),
    ('Long Island Blue Curaçao', 495.00),
    ('Long Island de Fresa',     495.00),
    ('Long Island Tokio',        495.00),
    ('Long Island de Naranja',   495.00),
    ('Aperol Spritz',            410.00),
    ('Daiquiri',                 385.00),
    ('Negroni',                  450.00),
    ('California',               385.00),
    ('Tequila Sunrise',          400.00),
    ('Mojito Clásico',           395.00),
    ('Mojito de Chinola',        395.00),
    ('Mojito de Fresa',          395.00),
    ('Mojito de Coco',           395.00)
) AS v(nombre, precio)
CROSS JOIN (
    SELECT id FROM familias
    WHERE nombre = 'Cócteles'
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
) AS f
WHERE NOT EXISTS (SELECT 1 FROM articulos WHERE nombre = v.nombre LIMIT 1);


-- Cervezas
INSERT INTO articulos (familia_id, nombre, precio_venta)
SELECT f.id, v.nombre, v.precio
FROM (VALUES
    ('Presidente Light',  200.00),
    ('Presidente Normal', 200.00),
    ('Modelo Rubia',      225.00),
    ('Modelo Negra',      225.00),
    ('Corona',            200.00)
) AS v(nombre, precio)
CROSS JOIN (
    SELECT id FROM familias
    WHERE nombre = 'Cervezas'
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
) AS f
WHERE NOT EXISTS (SELECT 1 FROM articulos WHERE nombre = v.nombre LIMIT 1);


-- Aguas
INSERT INTO articulos (familia_id, nombre, precio_venta)
SELECT f.id, v.nombre, v.precio
FROM (VALUES
    ('Agua Perrier',  180.00),
    ('Agua con soda', 120.00),
    ('Agua tónica',   120.00),
    ('Agua mineral',  800.00)
) AS v(nombre, precio)
CROSS JOIN (
    SELECT id FROM familias
    WHERE nombre = 'Aguas'
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
) AS f
WHERE NOT EXISTS (SELECT 1 FROM articulos WHERE nombre = v.nombre LIMIT 1);


-- Cafés Calientes
INSERT INTO articulos (familia_id, nombre, precio_venta)
SELECT f.id, v.nombre, v.precio
FROM (VALUES
    ('Café Americano', 120.00)
) AS v(nombre, precio)
CROSS JOIN (
    SELECT id FROM familias
    WHERE nombre = 'Cafés Calientes'
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
) AS f
WHERE NOT EXISTS (SELECT 1 FROM articulos WHERE nombre = v.nombre LIMIT 1);


-- Frappés
INSERT INTO articulos (familia_id, nombre, precio_venta)
SELECT f.id, v.nombre, v.precio
FROM (VALUES
    ('Mocachino frío', 290.00),
    ('Frappé Oreo',    310.00),
    ('Frappuccino',    260.00)
) AS v(nombre, precio)
CROSS JOIN (
    SELECT id FROM familias
    WHERE nombre = 'Frappés'
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
) AS f
WHERE NOT EXISTS (SELECT 1 FROM articulos WHERE nombre = v.nombre LIMIT 1);


-- Refrescos
INSERT INTO articulos (familia_id, nombre, precio_venta)
SELECT f.id, v.nombre, v.precio
FROM (VALUES
    ('Sprite',        90.00),
    ('Cocacola Zero', 90.00),
    ('Cocacola',      90.00)
) AS v(nombre, precio)
CROSS JOIN (
    SELECT id FROM familias
    WHERE nombre = 'Refrescos'
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
) AS f
WHERE NOT EXISTS (SELECT 1 FROM articulos WHERE nombre = v.nombre LIMIT 1);


-- Jugos y Sabores
INSERT INTO articulos (familia_id, nombre, precio_venta)
SELECT f.id, v.nombre, v.precio
FROM (VALUES
    ('Limón',         150.00),
    ('Chinola',       150.00),
    ('Fresa',         200.00),
    ('Cereza',        150.00),
    ('Naranja dulce', 150.00)
) AS v(nombre, precio)
CROSS JOIN (
    SELECT id FROM familias
    WHERE nombre = 'Jugos y Sabores'
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
) AS f
WHERE NOT EXISTS (SELECT 1 FROM articulos WHERE nombre = v.nombre LIMIT 1);


-- Entradas
INSERT INTO articulos (familia_id, nombre, precio_venta)
SELECT f.id, v.nombre, v.precio
FROM (VALUES
    ('Loaded Nachos',           550.00),
    ('Flautas 4 uds',           350.00),
    ('Sopes 3 uds',             400.00),
    ('Taquitos Dorados 3 uds',  350.00),
    ('Mozzarella Sticks 5 uds', 325.00),
    ('Holy Wings 6 uds',        325.00),
    ('Loaded Fries',            475.00),
    ('Mini Nachos',             300.00)
) AS v(nombre, precio)
CROSS JOIN (
    SELECT id FROM familias
    WHERE nombre = 'Entradas'
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
) AS f
WHERE NOT EXISTS (SELECT 1 FROM articulos WHERE nombre = v.nombre LIMIT 1);


-- Platos Fuertes
INSERT INTO articulos (familia_id, nombre, precio_venta)
SELECT f.id, v.nombre, v.precio
FROM (VALUES
    ('Burrito Pequeño',          550.00),
    ('Burrito Grande',           825.00),
    ('Burrito Bowl',             550.00),
    ('Tacos 3 uds',              450.00),
    ('Ceviche de Camarón',       525.00),
    ('Tacos de Birria 3 uds',    750.00),
    ('Tacos de Mero 3 uds',      475.00),
    ('Tacos de Camarones 3 uds', 475.00),
    ('Quesadilla de Pollo',      375.00),
    ('Mexican Hot Dogs',         375.00),
    ('Pizza Birria',            1020.00),
    ('Chicken Fingers',          325.00),
    ('Mini Quesadilla',          225.00)
) AS v(nombre, precio)
CROSS JOIN (
    SELECT id FROM familias
    WHERE nombre = 'Platos Fuertes'
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
) AS f
WHERE NOT EXISTS (SELECT 1 FROM articulos WHERE nombre = v.nombre LIMIT 1);


-- Postres
INSERT INTO articulos (familia_id, nombre, precio_venta)
SELECT f.id, v.nombre, v.precio
FROM (VALUES
    ('Brownie con Helado', 350.00),
    ('Mousse de Chinola',  250.00),
    ('Copa de Helado',     250.00),
    ('Mousse de Oreo',     250.00),
    ('Cheesecake',         350.00),
    ('Flan',               250.00)
) AS v(nombre, precio)
CROSS JOIN (
    SELECT id FROM familias
    WHERE nombre = 'Postres'
      AND sucursal_id = (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1)
    LIMIT 1
) AS f
WHERE NOT EXISTS (SELECT 1 FROM articulos WHERE nombre = v.nombre LIMIT 1);


-- =============================================================
-- DESTINOS DE IMPRESIÓN
-- =============================================================

INSERT INTO destinos_impresion (sucursal_id, nombre, tipo, ip_impresora, estado)
SELECT s.id, 'Barra', 'barra', NULL, 'activo'
FROM sucursales s
WHERE s.estado = 'activo'
  AND NOT EXISTS (
      SELECT 1 FROM destinos_impresion WHERE sucursal_id = s.id AND tipo = 'barra' LIMIT 1
  );

INSERT INTO destinos_impresion (sucursal_id, nombre, tipo, ip_impresora, estado)
SELECT s.id, 'Cocina', 'cocina', NULL, 'activo'
FROM sucursales s
WHERE s.estado = 'activo'
  AND NOT EXISTS (
      SELECT 1 FROM destinos_impresion WHERE sucursal_id = s.id AND tipo = 'cocina' LIMIT 1
  );


-- =============================================================
-- ZONAS Y MESAS
-- =============================================================

INSERT INTO zonas (sucursal_id, nombre, orden_visual, estado)
SELECT s.id, 'Bar', 1, 'activo'
FROM sucursales s
WHERE s.nombre = 'Central'
  AND NOT EXISTS (
      SELECT 1 FROM zonas WHERE nombre = 'Bar' AND sucursal_id = s.id LIMIT 1
  );

INSERT INTO zonas (sucursal_id, nombre, orden_visual, estado)
SELECT s.id, 'Terraza', 2, 'activo'
FROM sucursales s
WHERE s.nombre = 'Central'
  AND NOT EXISTS (
      SELECT 1 FROM zonas WHERE nombre = 'Terraza' AND sucursal_id = s.id LIMIT 1
  );

-- Mesas del Bar
INSERT INTO mesas (zona_id, nombre, capacidad, estado)
SELECT z.id, v.nombre, v.capacidad, 'libre'
FROM (VALUES ('Mesa 1', 4), ('Mesa 2', 2), ('Mesa 3', 2), ('Mesa 4', 6)) AS v(nombre, capacidad)
CROSS JOIN (SELECT id FROM zonas WHERE nombre = 'Bar' LIMIT 1) AS z
WHERE NOT EXISTS (
    SELECT 1 FROM mesas WHERE nombre = v.nombre AND zona_id = z.id LIMIT 1
);

-- Mesas de la Terraza
INSERT INTO mesas (zona_id, nombre, capacidad, estado)
SELECT z.id, v.nombre, v.capacidad, 'libre'
FROM (VALUES
    ('Mesa 5',  6), ('Mesa 6',  2), ('Mesa 7',  6),
    ('Mesa 8',  6), ('Mesa 9',  6), ('Mesa 10', 4)
) AS v(nombre, capacidad)
CROSS JOIN (SELECT id FROM zonas WHERE nombre = 'Terraza' LIMIT 1) AS z
WHERE NOT EXISTS (
    SELECT 1 FROM mesas WHERE nombre = v.nombre AND zona_id = z.id LIMIT 1
);


-- =============================================================
-- GRUPOS DE MODIFICADORES
-- =============================================================

INSERT INTO grupos_modificadores (nombre, tipo, seleccion, obligatorio, min_seleccion, max_seleccion, estado)
SELECT v.nombre, v.tipo, v.seleccion, v.obligatorio, v.min_sel, v.max_sel, 'activo'
FROM (VALUES
    ('Ofertas',         'articulo', 'unica', false, 0, 1),
    ('Sabor de Helado', 'articulo', 'unica', true,  1, 1)
) AS v(nombre, tipo, seleccion, obligatorio, min_sel, max_sel)
WHERE NOT EXISTS (
    SELECT 1 FROM grupos_modificadores WHERE nombre = v.nombre LIMIT 1
);


-- =============================================================
-- MODIFICADORES
-- =============================================================

-- Ofertas: 2x1
INSERT INTO modificadores (grupo_modificador_id, nombre, precio_extra, orden_visual, estado)
SELECT g.id, '2x1', 0, 1, 'activo'
FROM (SELECT id FROM grupos_modificadores WHERE nombre = 'Ofertas' LIMIT 1) AS g
WHERE NOT EXISTS (
    SELECT 1 FROM modificadores WHERE grupo_modificador_id = g.id AND nombre = '2x1' LIMIT 1
);

-- Sabor de Helado: Fresa, Chocolate, Bizcocho
INSERT INTO modificadores (grupo_modificador_id, nombre, precio_extra, orden_visual, estado)
SELECT g.id, v.nombre, 0, v.orden, 'activo'
FROM (VALUES ('Fresa', 1), ('Chocolate', 2), ('Bizcocho', 3)) AS v(nombre, orden)
CROSS JOIN (SELECT id FROM grupos_modificadores WHERE nombre = 'Sabor de Helado' LIMIT 1) AS g
WHERE NOT EXISTS (
    SELECT 1 FROM modificadores
    WHERE grupo_modificador_id = g.id AND nombre = v.nombre
    LIMIT 1
);


-- =============================================================
-- ARTÍCULOS ↔ GRUPOS DE MODIFICADORES
-- =============================================================

-- Whiskey Sour → Ofertas
INSERT INTO articulo_grupos_modificadores (articulo_id, grupo_modificador_id)
VALUES (
    (SELECT id FROM articulos WHERE nombre = 'Whiskey Sour' LIMIT 1),
    (SELECT id FROM grupos_modificadores WHERE nombre = 'Ofertas' LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- Copa de Helado → Sabor de Helado
INSERT INTO articulo_grupos_modificadores (articulo_id, grupo_modificador_id)
VALUES (
    (SELECT id FROM articulos WHERE nombre = 'Copa de Helado' LIMIT 1),
    (SELECT id FROM grupos_modificadores WHERE nombre = 'Sabor de Helado' LIMIT 1)
)
ON CONFLICT DO NOTHING;


-- =============================================================
-- IMPUESTOS DE LA SUCURSAL
-- ITBIS 18 % — obligatorio, se aplica primero
-- Propina 10 % — obligatoria, se aplica después
-- =============================================================

INSERT INTO sucursal_impuestos (sucursal_id, impuesto_id, obligatorio, orden_aplicacion)
VALUES (
    (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1),
    (SELECT id FROM impuestos WHERE nombre = 'ITBIS' LIMIT 1),
    true, 1
)
ON CONFLICT DO NOTHING;

INSERT INTO sucursal_impuestos (sucursal_id, impuesto_id, obligatorio, orden_aplicacion)
VALUES (
    (SELECT id FROM sucursales WHERE nombre = 'Central' LIMIT 1),
    (SELECT id FROM impuestos WHERE nombre = 'Propina' LIMIT 1),
    true, 2
)
ON CONFLICT DO NOTHING;

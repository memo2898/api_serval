-- =============================================================
-- SEED — Menú: Familias, Artículos y Precios
-- Sistema POS Restaurantes
-- Ejecutar DESPUÉS de seeders.sql (requiere usuarios, sucursales, etc.)
-- =============================================================


-- =============================================================
-- FAMILIAS
-- =============================================================

INSERT INTO familias (sucursal_id, nombre, color, icono, orden_visual, destino_impresion)
SELECT
    (SELECT id FROM sucursales WHERE nombre = 'Central'),
    nombre, color, icono, orden_visual, destino_impresion
FROM (VALUES
    ('Cócteles',        '#E91E63', 'fa-martini-glass',   1, 'barra'),
    ('Cervezas',        '#FF9800', 'fa-beer-mug-empty',  2, 'barra'),
    ('Aguas',           '#03A9F4', 'fa-droplet',         3, 'barra'),
    ('Cafés y Frappés', '#795548', 'fa-mug-hot',         4, 'barra'),
    ('Refrescos',       '#F44336', 'fa-bottle-water',    5, 'barra'),
    ('Jugos y Sabores', '#4CAF50', 'fa-lemon',           6, 'barra'),
    ('Entradas',        '#FF5722', 'fa-plate-wheat',     7, 'cocina'),
    ('Platos Fuertes',  '#9C27B0', 'fa-utensils',        8, 'cocina'),
    ('Postres',         '#FFC107', 'fa-ice-cream',       9, 'cocina')
) AS t(nombre, color, icono, orden_visual, destino_impresion);


-- =============================================================
-- ARTÍCULOS — Cócteles
-- =============================================================

INSERT INTO articulos (familia_id, nombre, precio_venta) VALUES
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Cuba Libre',              300.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Whiskey Sour',            400.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Ron Sour',                400.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Vodka Tonic',             425.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Gin Tonic Especiado',     425.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Gin Tonic Cítrico',       425.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Gin Tonic Afrutado',      425.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Moscow Mule',             400.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Margarita Clásica',       450.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Margarita de Chinola',    450.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Margarita de Fresa',      450.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Margarita de Coco',       450.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Screwdriver',             360.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Sex on the Beach',        395.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Sangría',                 390.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Long Island Tradicional', 495.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Long Island Ice Tea',     495.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Long Island Blue Curaçao',495.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Long Island de Fresa',    495.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Long Island Tokio',       495.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Long Island de Naranja',  495.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Aperol Spritz',           410.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Daiquiri',                385.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Negroni',                 450.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'California',              385.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Tequila Sunrise',         400.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Mojito Clásico',          395.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Mojito de Chinola',       395.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Mojito de Fresa',         395.00),
((SELECT id FROM familias WHERE nombre = 'Cócteles'), 'Mojito de Coco',          395.00);


-- =============================================================
-- ARTÍCULOS — Cervezas
-- =============================================================

INSERT INTO articulos (familia_id, nombre, precio_venta) VALUES
((SELECT id FROM familias WHERE nombre = 'Cervezas'), 'Presidente Light', 200.00),
((SELECT id FROM familias WHERE nombre = 'Cervezas'), 'Presidente Normal', 200.00),
((SELECT id FROM familias WHERE nombre = 'Cervezas'), 'Modelo Rubia',      225.00),
((SELECT id FROM familias WHERE nombre = 'Cervezas'), 'Modelo Negra',      225.00),
((SELECT id FROM familias WHERE nombre = 'Cervezas'), 'Corona',            200.00);


-- =============================================================
-- ARTÍCULOS — Aguas
-- =============================================================

INSERT INTO articulos (familia_id, nombre, precio_venta) VALUES
((SELECT id FROM familias WHERE nombre = 'Aguas'), 'Agua Perrier',  180.00),
((SELECT id FROM familias WHERE nombre = 'Aguas'), 'Agua con soda', 120.00),
((SELECT id FROM familias WHERE nombre = 'Aguas'), 'Agua tónica',   120.00),
((SELECT id FROM familias WHERE nombre = 'Aguas'), 'Agua mineral',  800.00);


-- =============================================================
-- ARTÍCULOS — Cafés y Frappés
-- =============================================================

INSERT INTO articulos (familia_id, nombre, precio_venta) VALUES
((SELECT id FROM familias WHERE nombre = 'Cafés y Frappés'), 'Mocachino frío',  290.00),
((SELECT id FROM familias WHERE nombre = 'Cafés y Frappés'), 'Frappé Oreo',     310.00),
((SELECT id FROM familias WHERE nombre = 'Cafés y Frappés'), 'Frappuccino',     260.00),
((SELECT id FROM familias WHERE nombre = 'Cafés y Frappés'), 'Café Americano',  120.00);


-- =============================================================
-- ARTÍCULOS — Refrescos
-- =============================================================

INSERT INTO articulos (familia_id, nombre, precio_venta) VALUES
((SELECT id FROM familias WHERE nombre = 'Refrescos'), 'Sprite',        90.00),
((SELECT id FROM familias WHERE nombre = 'Refrescos'), 'Cocacola Zero', 90.00),
((SELECT id FROM familias WHERE nombre = 'Refrescos'), 'Cocacola',      90.00);


-- =============================================================
-- ARTÍCULOS — Jugos y Sabores
-- =============================================================

INSERT INTO articulos (familia_id, nombre, precio_venta) VALUES
((SELECT id FROM familias WHERE nombre = 'Jugos y Sabores'), 'Limón',        150.00),
((SELECT id FROM familias WHERE nombre = 'Jugos y Sabores'), 'Chinola',      150.00),
((SELECT id FROM familias WHERE nombre = 'Jugos y Sabores'), 'Fresa',        200.00),
((SELECT id FROM familias WHERE nombre = 'Jugos y Sabores'), 'Cereza',       150.00),
((SELECT id FROM familias WHERE nombre = 'Jugos y Sabores'), 'Naranja dulce',150.00);


-- =============================================================
-- ARTÍCULOS — Entradas
-- =============================================================

INSERT INTO articulos (familia_id, nombre, precio_venta) VALUES
((SELECT id FROM familias WHERE nombre = 'Entradas'), 'Loaded Nachos',          550.00),
((SELECT id FROM familias WHERE nombre = 'Entradas'), 'Flautas 4 uds',          350.00),
((SELECT id FROM familias WHERE nombre = 'Entradas'), 'Sopes 3 uds',            400.00),
((SELECT id FROM familias WHERE nombre = 'Entradas'), 'Taquitos Dorados 3 uds', 350.00),
((SELECT id FROM familias WHERE nombre = 'Entradas'), 'Mozzarella Sticks 5 uds',325.00),
((SELECT id FROM familias WHERE nombre = 'Entradas'), 'Holy Wings 6 uds',       325.00),
((SELECT id FROM familias WHERE nombre = 'Entradas'), 'Loaded Fries',           475.00),
((SELECT id FROM familias WHERE nombre = 'Entradas'), 'Mini Nachos',            300.00);


-- =============================================================
-- ARTÍCULOS — Platos Fuertes
-- =============================================================

INSERT INTO articulos (familia_id, nombre, precio_venta) VALUES
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Burrito Pequeño',        550.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Burrito Grande',         825.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Burrito Bowl',           550.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Tacos 3 uds',            450.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Ceviche de Camarón',     525.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Tacos de Birria 3 uds',  750.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Tacos de Mero 3 uds',    475.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Tacos de Camarones 3 uds',475.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Quesadilla de Pollo',    375.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Mexican Hot Dogs',       375.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Pizza Birria',          1020.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Chicken Fingers',        325.00),
((SELECT id FROM familias WHERE nombre = 'Platos Fuertes'), 'Mini Quesadilla',        225.00);


-- =============================================================
-- ARTÍCULOS — Postres
-- =============================================================

INSERT INTO articulos (familia_id, nombre, precio_venta) VALUES
((SELECT id FROM familias WHERE nombre = 'Postres'), 'Brownie con Helado', 350.00),
((SELECT id FROM familias WHERE nombre = 'Postres'), 'Mousse de Chinola',  250.00),
((SELECT id FROM familias WHERE nombre = 'Postres'), 'Copa de Helado',     250.00),
((SELECT id FROM familias WHERE nombre = 'Postres'), 'Mousse de Oreo',     250.00),
((SELECT id FROM familias WHERE nombre = 'Postres'), 'Cheesecake',         350.00),
((SELECT id FROM familias WHERE nombre = 'Postres'), 'Flan',               250.00);


-- =============================================================
-- DESTINOS DE IMPRESIÓN
-- Un registro por tipo (barra/cocina) por cada sucursal.
-- El KDS usa estos IDs para filtrar comandas.
-- =============================================================

INSERT INTO destinos_impresion (sucursal_id, nombre, tipo, ip_impresora, estado)
SELECT id, 'Barra',  'barra',  NULL, 'activo' FROM sucursales WHERE estado = 'activo'
ON CONFLICT DO NOTHING;

INSERT INTO destinos_impresion (sucursal_id, nombre, tipo, ip_impresora, estado)
SELECT id, 'Cocina', 'cocina', NULL, 'activo' FROM sucursales WHERE estado = 'activo'
ON CONFLICT DO NOTHING;


-- =============================================================
-- ZONAS Y MESAS
-- =============================================================

INSERT INTO zonas (sucursal_id, nombre, orden_visual, estado)
SELECT id, 'Bar',     1, 'activo' FROM sucursales WHERE nombre = 'Central';

INSERT INTO zonas (sucursal_id, nombre, orden_visual, estado)
SELECT id, 'Terraza', 2, 'activo' FROM sucursales WHERE nombre = 'Central';

-- Mesas del Bar
INSERT INTO mesas (zona_id, nombre, capacidad, estado) VALUES
((SELECT id FROM zonas WHERE nombre = 'Bar'), 'Mesa 1',  4, 'libre'),
((SELECT id FROM zonas WHERE nombre = 'Bar'), 'Mesa 2',  2, 'libre'),
((SELECT id FROM zonas WHERE nombre = 'Bar'), 'Mesa 3',  2, 'libre'),
((SELECT id FROM zonas WHERE nombre = 'Bar'), 'Mesa 4',  6, 'libre');

-- Mesas de la Terraza
INSERT INTO mesas (zona_id, nombre, capacidad, estado) VALUES
((SELECT id FROM zonas WHERE nombre = 'Terraza'), 'Mesa 5',  6, 'libre'),
((SELECT id FROM zonas WHERE nombre = 'Terraza'), 'Mesa 6',  2, 'libre'),
((SELECT id FROM zonas WHERE nombre = 'Terraza'), 'Mesa 7',  6, 'libre'),
((SELECT id FROM zonas WHERE nombre = 'Terraza'), 'Mesa 8',  6, 'libre'),
((SELECT id FROM zonas WHERE nombre = 'Terraza'), 'Mesa 9',  6, 'libre'),
((SELECT id FROM zonas WHERE nombre = 'Terraza'), 'Mesa 10', 4, 'libre');

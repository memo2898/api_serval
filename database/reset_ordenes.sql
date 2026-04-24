-- ============================================================
-- reset_ordenes.sql
-- Limpia SOLO los datos transaccionales de órdenes y caja.
-- Respeta el orden de FK para evitar errores de constraint.
-- NO toca: usuarios, artículos, mesas, configuración, etc.
-- ============================================================

-- 1. KDS (depende de orden_lineas)
TRUNCATE TABLE kds_ordenes RESTART IDENTITY CASCADE;

-- 2. Modificadores de línea (depende de orden_lineas)
TRUNCATE TABLE orden_linea_modificadores RESTART IDENTITY CASCADE;

-- 3. Pagos de orden (depende de ordenes)
TRUNCATE TABLE orden_pagos RESTART IDENTITY CASCADE;

-- 4. Facturas (depende de ordenes)
TRUNCATE TABLE facturas RESTART IDENTITY CASCADE;

-- 5. Líneas de orden (depende de ordenes)
TRUNCATE TABLE orden_lineas RESTART IDENTITY CASCADE;

-- 6. Movimientos de stock ligados a órdenes
UPDATE movimientos_stock SET orden_id = NULL WHERE orden_id IS NOT NULL;

-- 7. Órdenes
TRUNCATE TABLE ordenes RESTART IDENTITY CASCADE;

-- 8. Movimientos de caja
TRUNCATE TABLE movimientos_caja RESTART IDENTITY CASCADE;

-- 9. Turnos de caja
TRUNCATE TABLE turnos_caja RESTART IDENTITY CASCADE;

-- 10. Liberar todas las mesas a estado 'libre'
UPDATE mesas SET estado = 'libre', personas = NULL;

-- Verificación rápida
SELECT 'ordenes'               AS tabla, COUNT(*) AS filas FROM ordenes
UNION ALL
SELECT 'orden_lineas',          COUNT(*) FROM orden_lineas
UNION ALL
SELECT 'orden_pagos',           COUNT(*) FROM orden_pagos
UNION ALL
SELECT 'orden_linea_mods',      COUNT(*) FROM orden_linea_modificadores
UNION ALL
SELECT 'kds_ordenes',           COUNT(*) FROM kds_ordenes
UNION ALL
SELECT 'facturas',              COUNT(*) FROM facturas
UNION ALL
SELECT 'turnos_caja',           COUNT(*) FROM turnos_caja
UNION ALL
SELECT 'movimientos_caja',      COUNT(*) FROM movimientos_caja;

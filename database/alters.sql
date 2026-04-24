-- ============================================================
-- alters.sql
-- Migraciones incrementales sobre el esquema base (DB.sql).
-- Ejecutar en orden. Cada bloque es idempotente donde es posible.
-- ============================================================


-- ============================================================
-- [2026-04-24] Desglose de impuestos en factura
-- Motivo: guardar snapshot de las tasas aplicadas al momento
-- del cobro para que las facturas históricas sean reconstruibles
-- aunque las tasas cambien en el futuro.
--
-- Estructura del array JSON:
-- [
--   { "id": 1, "nombre": "ITBIS",    "porcentaje": 18.00, "base": 1000.00, "monto": 180.00 },
--   { "id": 2, "nombre": "Servicio", "porcentaje": 10.00, "base": 1000.00, "monto": 100.00 }
-- ]
-- ============================================================

ALTER TABLE public.facturas
  ADD COLUMN IF NOT EXISTS impuestos_desglose JSONB DEFAULT '[]'::jsonb;

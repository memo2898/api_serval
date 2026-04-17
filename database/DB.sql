-- =============================================================
-- SISTEMA POS RESTAURANTES
-- Base de datos principal
-- Motor: PostgreSQL
-- =============================================================

-- =============================================================
-- MÓDULO 0 — TIPOS DE DOCUMENTO
-- (Se crea antes que empresas y clientes porque ambos lo referencian)
-- =============================================================

CREATE TABLE tipo_documentos (
    id                  SERIAL PRIMARY KEY,
    tipo                VARCHAR(45) NOT NULL,           -- Cédula, Pasaporte, RNC, DNI, NIT, Otro
    -- Para quién aplica este tipo de documento
    aplica_a            VARCHAR(20) NOT NULL DEFAULT 'ambos'
                        CHECK (aplica_a IN ('persona_fisica', 'persona_juridica', 'ambos')),
    -- Método de validación a ejecutar
    tipo_validacion     VARCHAR(20) NOT NULL DEFAULT 'ninguna'
                        CHECK (tipo_validacion IN ('ninguna', 'regex', 'funcion', 'ambos')),
    -- Expresión regular de formato (ej: ^\d{3}-\d{7}-\d{1}$ para cédula RD)
    regex_validacion    VARCHAR(500),
    -- Función JS arrow ejecutada en sandbox: (valor) => boolean
    funcion_validacion  TEXT,
    -- Ejemplo para input mask (ej: 000-0000000-0)
    formato_ejemplo     VARCHAR(50),
    estado              VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en         TIMESTAMP DEFAULT NOW(),
    agregado_por        INT,
    actualizado_en      TIMESTAMP DEFAULT NOW(),
    actualizado_por     INT
);

-- =============================================================
-- MÓDULO 1 — FUNDACIÓN / TENANCY
-- =============================================================

CREATE TABLE empresas (
    id                  SERIAL PRIMARY KEY,
    nombre              VARCHAR(150) NOT NULL,
    tipo_documento_id   INT REFERENCES tipo_documentos(id),
    numero_documento    VARCHAR(50),                    -- RNC, NIT, etc. según país
    logo                VARCHAR(500),
    estado              VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en         TIMESTAMP DEFAULT NOW(),
    agregado_por        INT,
    actualizado_en      TIMESTAMP DEFAULT NOW(),
    actualizado_por     INT
);

CREATE TABLE sucursales (
    id              SERIAL PRIMARY KEY,
    empresa_id      INT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nombre          VARCHAR(150) NOT NULL,
    direccion       VARCHAR(300),
    telefono        VARCHAR(20),
    estado          VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT,
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT
);

CREATE TABLE terminales (
    id              SERIAL PRIMARY KEY,
    sucursal_id     INT NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    nombre          VARCHAR(100) NOT NULL,
    estado          VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT,
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT
);

-- =============================================================
-- MÓDULO 2 — USUARIOS Y ACCESO
-- =============================================================

CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200)
);

CREATE TABLE permisos (
    id          SERIAL PRIMARY KEY,
    codigo      VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(200)
);

CREATE TABLE rol_permiso (
    rol_id      INT REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id  INT REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE usuarios (
    id              SERIAL PRIMARY KEY,
    sucursal_id     INT REFERENCES sucursales(id),
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100),
    username        VARCHAR(50) NOT NULL UNIQUE,
    pin             VARCHAR(10) NOT NULL,
    estado          VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

CREATE TABLE usuario_rol (
    usuario_id  INT REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_id      INT REFERENCES roles(id)    ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, rol_id)
);

-- FK de auditoría en empresas, sucursales y terminales apuntan a usuarios
-- Se agregan después para evitar dependencia circular
ALTER TABLE empresas   ADD CONSTRAINT fk_empresas_agregado_por    FOREIGN KEY (agregado_por)    REFERENCES usuarios(id);
ALTER TABLE empresas   ADD CONSTRAINT fk_empresas_actualizado_por  FOREIGN KEY (actualizado_por) REFERENCES usuarios(id);
ALTER TABLE sucursales ADD CONSTRAINT fk_sucursales_agregado_por   FOREIGN KEY (agregado_por)    REFERENCES usuarios(id);
ALTER TABLE sucursales ADD CONSTRAINT fk_sucursales_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES usuarios(id);
ALTER TABLE terminales ADD CONSTRAINT fk_terminales_agregado_por   FOREIGN KEY (agregado_por)    REFERENCES usuarios(id);
ALTER TABLE terminales ADD CONSTRAINT fk_terminales_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES usuarios(id);

-- =============================================================
-- MÓDULO 3 — MONEDAS, GEOGRAFÍA E IMPUESTOS
-- =============================================================

CREATE TABLE monedas (
    id        SERIAL PRIMARY KEY,
    codigo    CHAR(3) NOT NULL UNIQUE,   -- ISO 4217: DOP, USD, EUR
    nombre    VARCHAR(100) NOT NULL,     -- Peso Dominicano, Dólar, Euro
    simbolo   VARCHAR(10) NOT NULL,      -- RD$, $, €
    decimales INT NOT NULL DEFAULT 2,
    estado    VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo'))
);

CREATE TABLE paises (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    codigo_iso  CHAR(2) NOT NULL UNIQUE,
    moneda_id   INT REFERENCES monedas(id)
);

CREATE TABLE impuestos (
    id               SERIAL PRIMARY KEY,
    pais_id          INT REFERENCES paises(id),
    nombre           VARCHAR(100) NOT NULL,
    porcentaje       DECIMAL(5,2) NOT NULL,
    tipo             VARCHAR(20) NOT NULL CHECK (tipo IN ('general', 'especifico')),
    tipo_aplicacion  VARCHAR(20) NOT NULL CHECK (tipo_aplicacion IN ('sobre_precio', 'incluido_en_precio')),
    estado           VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en      TIMESTAMP DEFAULT NOW(),
    agregado_por     INT REFERENCES usuarios(id),
    actualizado_en   TIMESTAMP DEFAULT NOW(),
    actualizado_por  INT REFERENCES usuarios(id)
);

-- =============================================================
-- MÓDULO 4 — CATÁLOGO DE PRODUCTOS
-- =============================================================

CREATE TABLE familias (
    id                  SERIAL PRIMARY KEY,
    sucursal_id         INT REFERENCES sucursales(id) ON DELETE CASCADE,
    nombre              VARCHAR(100) NOT NULL,
    color               VARCHAR(7),
    icono               VARCHAR(100),
    orden_visual        INT DEFAULT 0,
    destino_impresion   VARCHAR(20) DEFAULT 'cocina'
                        CHECK (destino_impresion IN ('cocina', 'barra', 'caja', 'ninguno')),
    estado              VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en         TIMESTAMP DEFAULT NOW(),
    agregado_por        INT REFERENCES usuarios(id),
    actualizado_en      TIMESTAMP DEFAULT NOW(),
    actualizado_por     INT REFERENCES usuarios(id)
);

CREATE TABLE subfamilias (
    id              SERIAL PRIMARY KEY,
    familia_id      INT NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
    nombre          VARCHAR(100) NOT NULL,
    orden_visual    INT DEFAULT 0,
    estado          VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

CREATE TABLE articulos (
    id                  SERIAL PRIMARY KEY,
    familia_id          INT NOT NULL REFERENCES familias(id),
    subfamilia_id       INT REFERENCES subfamilias(id),
    nombre              VARCHAR(150) NOT NULL,
    descripcion         TEXT,
    referencia          VARCHAR(50),
    codigo_barras       VARCHAR(50),
    precio_venta        DECIMAL(10,2) NOT NULL DEFAULT 0,
    coste               DECIMAL(10,2) DEFAULT 0,
    tiene_stock         BOOLEAN DEFAULT FALSE,
    vendido_por_peso    BOOLEAN DEFAULT FALSE,
    impuesto_id         INT REFERENCES impuestos(id),
    tiempo_preparacion  INT DEFAULT 0,
    imagen              VARCHAR(500),
    estado              VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en         TIMESTAMP DEFAULT NOW(),
    agregado_por        INT REFERENCES usuarios(id),
    actualizado_en      TIMESTAMP DEFAULT NOW(),
    actualizado_por     INT REFERENCES usuarios(id)
);

CREATE TABLE articulo_impuestos (
    articulo_id  INT REFERENCES articulos(id) ON DELETE CASCADE,
    impuesto_id  INT REFERENCES impuestos(id) ON DELETE CASCADE,
    PRIMARY KEY (articulo_id, impuesto_id)
);

CREATE TABLE tarifas (
    id              SERIAL PRIMARY KEY,
    sucursal_id     INT REFERENCES sucursales(id) ON DELETE CASCADE,
    nombre          VARCHAR(100) NOT NULL,
    estado          VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

CREATE TABLE precios_por_tarifa (
    id           SERIAL PRIMARY KEY,
    articulo_id  INT REFERENCES articulos(id) ON DELETE CASCADE,
    tarifa_id    INT REFERENCES tarifas(id) ON DELETE CASCADE,
    precio       DECIMAL(10,2) NOT NULL,
    UNIQUE (articulo_id, tarifa_id)
);

-- =============================================================
-- MÓDULO 5 — ALÉRGENOS
-- =============================================================

CREATE TABLE alergenos (
    id     SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    icono  VARCHAR(100)
);

CREATE TABLE articulo_alergenos (
    articulo_id  INT REFERENCES articulos(id) ON DELETE CASCADE,
    alergeno_id  INT REFERENCES alergenos(id) ON DELETE CASCADE,
    PRIMARY KEY (articulo_id, alergeno_id)
);

-- =============================================================
-- MÓDULO 6 — MODIFICADORES
-- =============================================================

CREATE TABLE grupos_modificadores (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    tipo            VARCHAR(20) NOT NULL CHECK (tipo IN ('articulo', 'comentario')),
    seleccion       VARCHAR(20) NOT NULL DEFAULT 'unica' CHECK (seleccion IN ('unica', 'multiple')),
    obligatorio     BOOLEAN DEFAULT FALSE,
    min_seleccion   INT DEFAULT 0,
    max_seleccion   INT DEFAULT 1,
    estado          VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

CREATE TABLE modificadores (
    id                    SERIAL PRIMARY KEY,
    grupo_modificador_id  INT NOT NULL REFERENCES grupos_modificadores(id) ON DELETE CASCADE,
    nombre                VARCHAR(100) NOT NULL,
    precio_extra          DECIMAL(10,2) DEFAULT 0,
    orden_visual          INT DEFAULT 0,
    estado                VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en           TIMESTAMP DEFAULT NOW(),
    agregado_por          INT REFERENCES usuarios(id),
    actualizado_en        TIMESTAMP DEFAULT NOW(),
    actualizado_por       INT REFERENCES usuarios(id)
);

CREATE TABLE articulo_grupos_modificadores (
    articulo_id           INT REFERENCES articulos(id) ON DELETE CASCADE,
    grupo_modificador_id  INT REFERENCES grupos_modificadores(id) ON DELETE CASCADE,
    PRIMARY KEY (articulo_id, grupo_modificador_id)
);

-- =============================================================
-- MÓDULO 7 — COMBOS Y MENÚS
-- =============================================================

CREATE TABLE combos (
    id              SERIAL PRIMARY KEY,
    sucursal_id     INT REFERENCES sucursales(id) ON DELETE CASCADE,
    nombre          VARCHAR(150) NOT NULL,
    precio          DECIMAL(10,2) NOT NULL,
    estado          VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

CREATE TABLE combo_articulos (
    id              SERIAL PRIMARY KEY,
    combo_id        INT REFERENCES combos(id) ON DELETE CASCADE,
    articulo_id     INT REFERENCES articulos(id),
    cantidad        INT DEFAULT 1,
    precio_especial DECIMAL(10,2)
);

-- =============================================================
-- MÓDULO 8 — SALÓN (MESAS)
-- =============================================================

CREATE TABLE zonas (
    id              SERIAL PRIMARY KEY,
    sucursal_id     INT NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    nombre          VARCHAR(100) NOT NULL,
    orden_visual    INT DEFAULT 0,
    estado          VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

CREATE TABLE mesas (
    id              SERIAL PRIMARY KEY,
    zona_id         INT NOT NULL REFERENCES zonas(id) ON DELETE CASCADE,
    nombre          VARCHAR(50) NOT NULL,
    capacidad       INT DEFAULT 4,
    mesa_principal_id INT REFERENCES mesas(id),
    posicion_x      DECIMAL(8,2) DEFAULT 0,
    posicion_y      DECIMAL(8,2) DEFAULT 0,
    -- estado operativo de la mesa (no es auditoría)
    estado          VARCHAR(20) DEFAULT 'libre'
                    CHECK (estado IN ('libre', 'ocupada', 'reservada', 'por_cobrar', 'bloqueada')),
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

-- =============================================================
-- MÓDULO 9 — CLIENTES
-- =============================================================

CREATE TABLE clientes (
    id                  SERIAL PRIMARY KEY,
    empresa_id          INT REFERENCES empresas(id),
    nombre              VARCHAR(100) NOT NULL,
    apellido            VARCHAR(100),
    email               VARCHAR(150),
    telefono            VARCHAR(20),
    tipo_documento_id   INT REFERENCES tipo_documentos(id),
    numero_documento    VARCHAR(50),
    direccion           VARCHAR(300),
    estado              VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en         TIMESTAMP DEFAULT NOW(),
    agregado_por        INT REFERENCES usuarios(id),
    actualizado_en      TIMESTAMP DEFAULT NOW(),
    actualizado_por     INT REFERENCES usuarios(id)
);

-- =============================================================
-- MÓDULO 10 — FORMAS DE PAGO
-- =============================================================

CREATE TABLE formas_pago (
    id                   SERIAL PRIMARY KEY,
    sucursal_id          INT REFERENCES sucursales(id),
    nombre               VARCHAR(100) NOT NULL,
    tipo                 VARCHAR(20) NOT NULL CHECK (tipo IN ('efectivo', 'electronico', 'credito')),
    requiere_referencia  BOOLEAN DEFAULT FALSE,
    estado               VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en          TIMESTAMP DEFAULT NOW(),
    agregado_por         INT REFERENCES usuarios(id),
    actualizado_en       TIMESTAMP DEFAULT NOW(),
    actualizado_por      INT REFERENCES usuarios(id)
);

-- =============================================================
-- MÓDULO 11 — DESCUENTOS
-- =============================================================

CREATE TABLE descuentos (
    id                    SERIAL PRIMARY KEY,
    sucursal_id           INT REFERENCES sucursales(id) ON DELETE CASCADE,
    nombre                VARCHAR(100) NOT NULL,
    tipo                  VARCHAR(20) NOT NULL CHECK (tipo IN ('porcentaje', 'monto_fijo')),
    valor                 DECIMAL(10,2) NOT NULL,
    aplica_a              VARCHAR(20) NOT NULL CHECK (aplica_a IN ('orden', 'linea', 'familia', 'articulo')),
    requiere_autorizacion BOOLEAN DEFAULT FALSE,
    fecha_inicio          DATE,
    fecha_fin             DATE,
    estado                VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en           TIMESTAMP DEFAULT NOW(),
    agregado_por          INT REFERENCES usuarios(id),
    actualizado_en        TIMESTAMP DEFAULT NOW(),
    actualizado_por       INT REFERENCES usuarios(id)
);

-- =============================================================
-- MÓDULO 12 — CAJA Y TURNOS
-- =============================================================

CREATE TABLE turnos_caja (
    id                      SERIAL PRIMARY KEY,
    terminal_id             INT REFERENCES terminales(id),
    usuario_id              INT REFERENCES usuarios(id),
    fecha_apertura          TIMESTAMP DEFAULT NOW(),
    fecha_cierre            TIMESTAMP,
    monto_apertura          DECIMAL(10,2) DEFAULT 0,
    monto_cierre_declarado  DECIMAL(10,2),
    monto_cierre_real       DECIMAL(10,2),
    -- estado del turno (no es auditoría)
    estado                  VARCHAR(20) DEFAULT 'abierto' CHECK (estado IN ('abierto', 'cerrado')),
    agregado_en             TIMESTAMP DEFAULT NOW(),
    agregado_por            INT REFERENCES usuarios(id),
    actualizado_en          TIMESTAMP DEFAULT NOW(),
    actualizado_por         INT REFERENCES usuarios(id)
);

CREATE TABLE movimientos_caja (
    id           SERIAL PRIMARY KEY,
    turno_id     INT NOT NULL REFERENCES turnos_caja(id),
    tipo         VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'salida')),
    monto        DECIMAL(10,2) NOT NULL,
    concepto     VARCHAR(200),
    agregado_en  TIMESTAMP DEFAULT NOW(),
    agregado_por INT REFERENCES usuarios(id)
);

-- =============================================================
-- MÓDULO 13 — ÓRDENES / COMANDAS (Núcleo del sistema)
-- =============================================================

CREATE TABLE ordenes (
    id              SERIAL PRIMARY KEY,
    sucursal_id     INT NOT NULL REFERENCES sucursales(id),
    terminal_id     INT REFERENCES terminales(id),
    usuario_id      INT REFERENCES usuarios(id),
    mesa_id         INT REFERENCES mesas(id),
    cliente_id      INT REFERENCES clientes(id),
    turno_id        INT REFERENCES turnos_caja(id),
    tipo_servicio   VARCHAR(20) NOT NULL DEFAULT 'mesa'
                    CHECK (tipo_servicio IN ('mesa', 'barra', 'take_away', 'delivery')),
    -- estado operativo de la orden (no es auditoría)
    estado          VARCHAR(20) DEFAULT 'abierta'
                    CHECK (estado IN ('abierta', 'en_preparacion', 'lista', 'cobrada', 'cancelada', 'anulada')),
    numero_orden    INT,
    descuento_total DECIMAL(10,2) DEFAULT 0,
    subtotal        DECIMAL(10,2) DEFAULT 0,
    impuestos_total DECIMAL(10,2) DEFAULT 0,
    total           DECIMAL(10,2) DEFAULT 0,
    notas           TEXT,
    fecha_apertura  TIMESTAMP DEFAULT NOW(),
    fecha_cierre    TIMESTAMP,
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

CREATE TABLE orden_lineas (
    id               SERIAL PRIMARY KEY,
    orden_id         INT NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
    articulo_id      INT NOT NULL REFERENCES articulos(id),
    cantidad         DECIMAL(10,3) NOT NULL DEFAULT 1,
    precio_unitario  DECIMAL(10,2) NOT NULL,
    descuento_linea  DECIMAL(10,2) DEFAULT 0,
    impuesto_linea   DECIMAL(10,2) DEFAULT 0,
    subtotal_linea   DECIMAL(10,2) NOT NULL,
    -- estado operativo de la línea (no es auditoría)
    estado           VARCHAR(20) DEFAULT 'pendiente'
                     CHECK (estado IN ('pendiente', 'en_preparacion', 'lista', 'entregada', 'cancelada')),
    enviado_a_cocina BOOLEAN DEFAULT FALSE,
    fecha_envio      TIMESTAMP,
    cuenta_num       INT DEFAULT 1,
    notas_linea      TEXT,
    agregado_en      TIMESTAMP DEFAULT NOW(),
    agregado_por     INT REFERENCES usuarios(id),
    actualizado_en   TIMESTAMP DEFAULT NOW(),
    actualizado_por  INT REFERENCES usuarios(id)
);

CREATE TABLE orden_linea_modificadores (
    id              SERIAL PRIMARY KEY,
    orden_linea_id  INT NOT NULL REFERENCES orden_lineas(id) ON DELETE CASCADE,
    modificador_id  INT NOT NULL REFERENCES modificadores(id),
    precio_extra    DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE orden_pagos (
    id            SERIAL PRIMARY KEY,
    orden_id      INT NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
    forma_pago_id INT NOT NULL REFERENCES formas_pago(id),
    moneda_id     INT REFERENCES monedas(id),
    monto         DECIMAL(10,2) NOT NULL,
    referencia    VARCHAR(100),
    agregado_en   TIMESTAMP DEFAULT NOW(),
    agregado_por  INT REFERENCES usuarios(id)
);

-- =============================================================
-- MÓDULO 14 — FACTURACIÓN / TICKETS
-- =============================================================

CREATE TABLE facturas (
    id              SERIAL PRIMARY KEY,
    orden_id        INT NOT NULL REFERENCES ordenes(id),
    cliente_id      INT REFERENCES clientes(id),
    numero_factura  VARCHAR(50) NOT NULL,
    tipo            VARCHAR(20) DEFAULT 'ticket' CHECK (tipo IN ('ticket', 'factura')),
    subtotal        DECIMAL(10,2) NOT NULL,
    impuestos       DECIMAL(10,2) DEFAULT 0,
    total           DECIMAL(10,2) NOT NULL,
    anulada         BOOLEAN DEFAULT FALSE,
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

-- =============================================================
-- MÓDULO 15 — COCINA / KDS
-- =============================================================

CREATE TABLE destinos_impresion (
    id              SERIAL PRIMARY KEY,
    sucursal_id     INT REFERENCES sucursales(id) ON DELETE CASCADE,
    nombre          VARCHAR(100) NOT NULL,
    tipo            VARCHAR(20) NOT NULL CHECK (tipo IN ('impresora', 'pantalla_kds')),
    ip_impresora    VARCHAR(50),
    estado          VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

CREATE TABLE kds_ordenes (
    id               SERIAL PRIMARY KEY,
    orden_linea_id   INT NOT NULL REFERENCES orden_lineas(id) ON DELETE CASCADE,
    destino_id       INT NOT NULL REFERENCES destinos_impresion(id),
    -- estado operativo del KDS (no es auditoría)
    estado           VARCHAR(20) DEFAULT 'pendiente'
                     CHECK (estado IN ('pendiente', 'en_preparacion', 'listo')),
    tiempo_recibido  TIMESTAMP DEFAULT NOW(),
    tiempo_preparado TIMESTAMP
);

-- =============================================================
-- MÓDULO 16 — INVENTARIO / STOCK
-- =============================================================

CREATE TABLE stock (
    articulo_id      INT REFERENCES articulos(id) ON DELETE CASCADE,
    sucursal_id      INT REFERENCES sucursales(id) ON DELETE CASCADE,
    cantidad_actual  DECIMAL(10,3) DEFAULT 0,
    cantidad_minima  DECIMAL(10,3) DEFAULT 0,
    PRIMARY KEY (articulo_id, sucursal_id)
);

CREATE TABLE movimientos_stock (
    id           SERIAL PRIMARY KEY,
    articulo_id  INT NOT NULL REFERENCES articulos(id),
    sucursal_id  INT NOT NULL REFERENCES sucursales(id),
    tipo         VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'salida', 'ajuste', 'merma')),
    cantidad     DECIMAL(10,3) NOT NULL,
    referencia   VARCHAR(100),
    orden_id     INT REFERENCES ordenes(id),
    agregado_en  TIMESTAMP DEFAULT NOW(),
    agregado_por INT REFERENCES usuarios(id)
);

-- =============================================================
-- MÓDULO 17 — CONFIGURACIÓN POR SUCURSAL
-- =============================================================

CREATE TABLE configuracion_sucursal (
    sucursal_id                  INT PRIMARY KEY REFERENCES sucursales(id) ON DELETE CASCADE,
    tiene_mesas                  BOOLEAN DEFAULT TRUE,
    tiene_delivery               BOOLEAN DEFAULT FALSE,
    tiene_barra                  BOOLEAN DEFAULT FALSE,
    impuesto_defecto_id          INT REFERENCES impuestos(id),
    tarifa_defecto_id            INT REFERENCES tarifas(id),
    moneda_id                    INT REFERENCES monedas(id),
    formato_fecha                VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    zona_horaria                 VARCHAR(50) DEFAULT 'America/Santo_Domingo',
    permite_venta_sin_stock      BOOLEAN DEFAULT TRUE,
    requiere_mesa_para_orden     BOOLEAN DEFAULT TRUE,
    imprime_automatico_al_cerrar BOOLEAN DEFAULT FALSE,
    actualizado_en               TIMESTAMP DEFAULT NOW(),
    actualizado_por              INT REFERENCES usuarios(id)
);

-- =============================================================
-- MÓDULO 18 — RESERVACIONES
-- =============================================================

CREATE TABLE reservaciones (
    id              SERIAL PRIMARY KEY,
    sucursal_id     INT NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    mesa_id         INT REFERENCES mesas(id),           -- puede asignarse después
    cliente_id      INT REFERENCES clientes(id),
    -- datos del contacto (si no es cliente registrado)
    nombre_contacto VARCHAR(150),
    telefono        VARCHAR(20),
    -- tiempo
    fecha_hora      TIMESTAMP NOT NULL,
    duracion_min    INT DEFAULT 90,                     -- duración estimada en minutos
    -- comensales
    num_personas    INT NOT NULL DEFAULT 1,
    -- estado del ciclo de vida
    estado          VARCHAR(20) DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente', 'confirmada', 'sentada', 'cancelada', 'no_show')),
    notas           TEXT,
    -- si se cancela, quién y cuándo
    cancelada_en    TIMESTAMP,
    cancelada_por   INT REFERENCES usuarios(id),
    motivo_cancelacion VARCHAR(300),
    -- auditoría
    agregado_en     TIMESTAMP DEFAULT NOW(),
    agregado_por    INT REFERENCES usuarios(id),
    actualizado_en  TIMESTAMP DEFAULT NOW(),
    actualizado_por INT REFERENCES usuarios(id)
);

-- =============================================================
-- ÍNDICES PARA RENDIMIENTO
-- =============================================================

CREATE INDEX idx_ordenes_sucursal    ON ordenes(sucursal_id);
CREATE INDEX idx_ordenes_estado      ON ordenes(estado);
CREATE INDEX idx_ordenes_mesa        ON ordenes(mesa_id);
CREATE INDEX idx_ordenes_turno       ON ordenes(turno_id);
CREATE INDEX idx_orden_lineas_orden  ON orden_lineas(orden_id);
CREATE INDEX idx_orden_lineas_estado ON orden_lineas(estado);
CREATE INDEX idx_kds_destino         ON kds_ordenes(destino_id);
CREATE INDEX idx_kds_estado          ON kds_ordenes(estado);
CREATE INDEX idx_mesas_zona          ON mesas(zona_id);
CREATE INDEX idx_mesas_estado        ON mesas(estado);
CREATE INDEX idx_articulos_familia   ON articulos(familia_id);
CREATE INDEX idx_usuarios_sucursal      ON usuarios(sucursal_id);
CREATE INDEX idx_turnos_terminal        ON turnos_caja(terminal_id);
CREATE INDEX idx_turnos_estado          ON turnos_caja(estado);
CREATE INDEX idx_reservaciones_sucursal ON reservaciones(sucursal_id);
CREATE INDEX idx_reservaciones_fecha    ON reservaciones(fecha_hora);
CREATE INDEX idx_reservaciones_estado   ON reservaciones(estado);
CREATE INDEX idx_reservaciones_mesa     ON reservaciones(mesa_id);

DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Eliminar todas las tablas
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
    END LOOP;
    
    -- Eliminar todos los tipos personalizados
    FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e')
    LOOP
        EXECUTE 'DROP TYPE IF EXISTS "' || r.typname || '" CASCADE';
    END LOOP;
END $$;
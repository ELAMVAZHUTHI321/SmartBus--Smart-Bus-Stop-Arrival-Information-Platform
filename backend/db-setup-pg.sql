-- SmartBus Postgres setup: run once as superuser (postgres).
-- Local PostgreSQL 18 (already installed, service postgresql-x64-18 on port 5432):
--   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -f db-setup-pg.sql
-- Docker alternative:
--   docker run --name smartbus-pg -e POSTGRES_USER=smartbus -e POSTGRES_PASSWORD=SmartBus!dev2026 -e POSTGRES_DB=smartbus -p 5432:5432 -d postgres:16
--
-- This script is idempotent (safe to re-run). It does NOT create tables:
-- tables are created by backend/schema-pg.sql or by Hibernate ddl-auto:update.

SELECT 'CREATE DATABASE smartbus'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smartbus')\gexec

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'smartbus') THEN
    CREATE ROLE smartbus WITH LOGIN PASSWORD 'SmartBus!dev2026';
  ELSE
    ALTER ROLE smartbus WITH LOGIN PASSWORD 'SmartBus!dev2026';
  END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE smartbus TO smartbus;

-- Schema-level grants must run inside the smartbus DB (see below).
\c smartbus

GRANT ALL ON SCHEMA public TO smartbus;
ALTER SCHEMA public OWNER TO smartbus;
ALTER DATABASE smartbus OWNER TO smartbus;

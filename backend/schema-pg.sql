-- SmartBus Postgres schema (17 tables).
-- Derived from JPA entities in backend/src/main/java/com/smartbus/entity/.
-- All PKs are VARCHAR(36) UUID strings (see User.prePersist etc.).
-- Apply after db-setup-pg.sql:
--   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -U smartbus -d smartbus -f schema-pg.sql
-- Safe to re-run (IF NOT EXISTS + DO blocks). Matches Hibernate ddl-auto:update output,
-- so the backend can also create these automatically on first boot.

-- ---------------------------------------------------------------- users
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(36)  PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL CHECK (role IN ('PASSENGER', 'OPERATOR', 'ADMIN')),
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  phone         VARCHAR(50),
  created_at    TIMESTAMPTZ  NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ---------------------------------------------------------------- passengers / operators
CREATE TABLE IF NOT EXISTS passengers (
  id         VARCHAR(36) PRIMARY KEY,
  user_id    VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  phone      VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS transport_operators (
  id                VARCHAR(36)  PRIMARY KEY,
  user_id           VARCHAR(36)  NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  organization_name VARCHAR(150) NOT NULL,
  contact_number    VARCHAR(50),
  created_at        TIMESTAMPTZ  NOT NULL
);

-- ---------------------------------------------------------------- buses / routes / stops
CREATE TABLE IF NOT EXISTS buses (
  id          VARCHAR(36)  PRIMARY KEY,
  operator_id VARCHAR(36)  NOT NULL REFERENCES transport_operators(id) ON DELETE RESTRICT,
  bus_number  VARCHAR(50)  NOT NULL UNIQUE,
  bus_type    VARCHAR(50),
  capacity    INTEGER,
  status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
              CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
  created_at  TIMESTAMPTZ  NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_buses_number ON buses(bus_number);

CREATE TABLE IF NOT EXISTS bus_routes (
  id          VARCHAR(36)  PRIMARY KEY,
  route_name  VARCHAR(150) NOT NULL UNIQUE,
  source      VARCHAR(150),
  destination VARCHAR(150),
  status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
              CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at  TIMESTAMPTZ  NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_routes_name ON bus_routes(route_name);

CREATE TABLE IF NOT EXISTS bus_stops (
  id         VARCHAR(36)  PRIMARY KEY,
  stop_name  VARCHAR(150) NOT NULL,
  latitude   DOUBLE PRECISION,
  longitude  DOUBLE PRECISION,
  address    VARCHAR(255),
  created_at TIMESTAMPTZ  NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_stops_name ON bus_stops(stop_name);

CREATE TABLE IF NOT EXISTS route_stops (
  id          VARCHAR(36) PRIMARY KEY,
  route_id    VARCHAR(36) NOT NULL REFERENCES bus_routes(id) ON DELETE CASCADE,
  stop_id     VARCHAR(36) NOT NULL REFERENCES bus_stops(id) ON DELETE CASCADE,
  stop_order  INTEGER     NOT NULL,
  distance_km DOUBLE PRECISION,
  UNIQUE (route_id, stop_id)
);
CREATE INDEX IF NOT EXISTS idx_route_stops_route ON route_stops(route_id, stop_order);

-- ---------------------------------------------------------------- schedules / trips / locations / predictions
CREATE TABLE IF NOT EXISTS bus_schedules (
  id             VARCHAR(36) PRIMARY KEY,
  route_id       VARCHAR(36) NOT NULL REFERENCES bus_routes(id) ON DELETE CASCADE,
  bus_id         VARCHAR(36) NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
  departure_time VARCHAR(20),
  arrival_time   VARCHAR(20),
  days           VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS bus_trips (
  id          VARCHAR(36) PRIMARY KEY,
  bus_id      VARCHAR(36) NOT NULL REFERENCES buses(id) ON DELETE RESTRICT,
  route_id    VARCHAR(36) NOT NULL REFERENCES bus_routes(id) ON DELETE RESTRICT,
  schedule_id VARCHAR(36) REFERENCES bus_schedules(id) ON DELETE SET NULL,
  trip_date   VARCHAR(20),
  start_time  TIMESTAMPTZ,
  end_time    TIMESTAMPTZ,
  status      VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED'
              CHECK (status IN ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'))
);
CREATE INDEX IF NOT EXISTS idx_trips_date ON bus_trips(trip_date);
CREATE INDEX IF NOT EXISTS idx_trips_status ON bus_trips(status);

CREATE TABLE IF NOT EXISTS bus_locations (
  id          VARCHAR(36) PRIMARY KEY,
  trip_id     VARCHAR(36) NOT NULL REFERENCES bus_trips(id) ON DELETE CASCADE,
  latitude    DOUBLE PRECISION NOT NULL,
  longitude   DOUBLE PRECISION NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_locations_trip_time ON bus_locations(trip_id, recorded_at);

CREATE TABLE IF NOT EXISTS arrival_predictions (
  id                VARCHAR(36) PRIMARY KEY,
  trip_id           VARCHAR(36) NOT NULL REFERENCES bus_trips(id) ON DELETE CASCADE,
  stop_id           VARCHAR(36) NOT NULL REFERENCES bus_stops(id) ON DELETE CASCADE,
  predicted_arrival TIMESTAMPTZ NOT NULL,
  prediction_time   TIMESTAMPTZ NOT NULL,
  confidence_score  DOUBLE PRECISION
);
CREATE INDEX IF NOT EXISTS idx_predictions_trip_stop ON arrival_predictions(trip_id, stop_id);

-- ---------------------------------------------------------------- favorites
CREATE TABLE IF NOT EXISTS favorite_stops (
  id           VARCHAR(36) PRIMARY KEY,
  passenger_id VARCHAR(36) NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
  stop_id      VARCHAR(36) NOT NULL REFERENCES bus_stops(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL,
  UNIQUE (passenger_id, stop_id)
);

CREATE TABLE IF NOT EXISTS favorite_routes (
  id           VARCHAR(36) PRIMARY KEY,
  passenger_id VARCHAR(36) NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
  route_id     VARCHAR(36) NOT NULL REFERENCES bus_routes(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL,
  UNIQUE (passenger_id, route_id)
);

-- ---------------------------------------------------------------- notifications / reports / feedback / audit
CREATE TABLE IF NOT EXISTS notifications (
  id         VARCHAR(36)  PRIMARY KEY,
  user_id    VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(150) NOT NULL,
  message    TEXT         NOT NULL,
  type       VARCHAR(20)  NOT NULL DEFAULT 'SYSTEM'
             CHECK (type IN ('INFO', 'ALERT', 'REMINDER', 'SYSTEM')),
  is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ  NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS delay_reports (
  id            VARCHAR(36) PRIMARY KEY,
  trip_id       VARCHAR(36) NOT NULL REFERENCES bus_trips(id) ON DELETE CASCADE,
  passenger_id  VARCHAR(36) NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
  reason        TEXT,
  delay_minutes INTEGER,
  created_at    TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
  id           VARCHAR(36) PRIMARY KEY,
  trip_id      VARCHAR(36) NOT NULL REFERENCES bus_trips(id) ON DELETE CASCADE,
  passenger_id VARCHAR(36) NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
  rating       INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comments     TEXT,
  created_at   TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id          VARCHAR(36)  PRIMARY KEY,
  user_id     VARCHAR(36)  REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id   VARCHAR(36),
  created_at  TIMESTAMPTZ  NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_user_time ON audit_logs(user_id, created_at);

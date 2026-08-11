# SmartBus – Database Design

## 1. Project

SmartBus – Smart Bus Stop Arrival Information Platform

## 2. Database & Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Java Spring Boot |
| Programming Language | Java 21 |
| Database | MySQL 8 |
| ORM | Spring Data JPA / Hibernate |
| Authentication | Spring Security + JWT |
| API | REST API |
| Build Tool | Apache Maven 3.9.16 |
| Database Tool | MySQL Workbench |
| API Testing | Postman |
| Version Control | Git + GitHub |
| IDE | VS Code / Eclipse |
| Server Port | 8081 |

## 3. Database Overview

The SmartBus database manages users, passengers, transport operators, buses, routes, bus stops, schedules, trips, bus locations, arrival predictions, favorites, notifications, reports, feedback, and audit logs.

## 4. Tables

### 4.1 users

| Column | Type | Constraints |
|---|---|---|
| user_id | BIGINT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| role | ENUM | PASSENGER, OPERATOR, ADMIN |
| created_at | DATETIME | NOT NULL |
| updated_at | DATETIME | NULL |

### 4.2 passengers

| Column | Type | Constraints |
|---|---|---|
| passenger_id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK, UNIQUE, NOT NULL |
| phone | VARCHAR(20) | NULL |
| created_at | DATETIME | NOT NULL |

**FK:** user_id → users.user_id

### 4.3 transport_operators

| Column | Type | Constraints |
|---|---|---|
| operator_id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK, UNIQUE, NOT NULL |
| organization_name | VARCHAR(150) | NOT NULL |
| contact_number | VARCHAR(20) | NULL |
| created_at | DATETIME | NOT NULL |

**FK:** user_id → users.user_id

### 4.4 buses

| Column | Type | Constraints |
|---|---|---|
| bus_id | BIGINT | PK, AUTO_INCREMENT |
| operator_id | BIGINT | FK, NOT NULL |
| bus_number | VARCHAR(50) | UNIQUE, NOT NULL |
| bus_type | VARCHAR(50) | NULL |
| capacity | INT | NULL |
| status | ENUM | ACTIVE, INACTIVE, MAINTENANCE |
| created_at | DATETIME | NOT NULL |

**FK:** operator_id → transport_operators.operator_id

### 4.5 bus_routes

| Column | Type | Constraints |
|---|---|---|
| route_id | BIGINT | PK, AUTO_INCREMENT |
| route_name | VARCHAR(150) | NOT NULL |
| source | VARCHAR(150) | NOT NULL |
| destination | VARCHAR(150) | NOT NULL |
| status | ENUM | ACTIVE, INACTIVE |
| created_at | DATETIME | NOT NULL |

### 4.6 bus_stops

| Column | Type | Constraints |
|---|---|---|
| stop_id | BIGINT | PK, AUTO_INCREMENT |
| stop_name | VARCHAR(150) | NOT NULL |
| latitude | DECIMAL(10,7) | NOT NULL |
| longitude | DECIMAL(10,7) | NOT NULL |
| address | VARCHAR(255) | NULL |
| created_at | DATETIME | NOT NULL |

### 4.7 route_stops

Connects routes and stops and stores the stop sequence.

| Column | Type | Constraints |
|---|---|---|
| route_stop_id | BIGINT | PK, AUTO_INCREMENT |
| route_id | BIGINT | FK, NOT NULL |
| stop_id | BIGINT | FK, NOT NULL |
| stop_order | INT | NOT NULL |
| distance_km | DECIMAL(8,2) | NULL |

**FKs:** route_id → bus_routes.route_id, stop_id → bus_stops.stop_id

**Unique:** (route_id, stop_id)

### 4.8 bus_schedules

| Column | Type | Constraints |
|---|---|---|
| schedule_id | BIGINT | PK, AUTO_INCREMENT |
| route_id | BIGINT | FK, NOT NULL |
| bus_id | BIGINT | FK, NOT NULL |
| departure_time | TIME | NOT NULL |
| arrival_time | TIME | NOT NULL |
| days_of_week | VARCHAR(50) | NOT NULL |

**FKs:** route_id → bus_routes.route_id, bus_id → buses.bus_id

### 4.9 bus_trips

Stores individual bus journeys.

| Column | Type | Constraints |
|---|---|---|
| trip_id | BIGINT | PK, AUTO_INCREMENT |
| bus_id | BIGINT | FK, NOT NULL |
| route_id | BIGINT | FK, NOT NULL |
| schedule_id | BIGINT | FK, NULL |
| trip_date | DATE | NOT NULL |
| start_time | DATETIME | NULL |
| end_time | DATETIME | NULL |
| status | ENUM | SCHEDULED, ONGOING, COMPLETED, CANCELLED |

### 4.10 bus_locations

Stores bus location history during a trip.

| Column | Type | Constraints |
|---|---|---|
| location_id | BIGINT | PK, AUTO_INCREMENT |
| trip_id | BIGINT | FK, NOT NULL |
| latitude | DECIMAL(10,7) | NOT NULL |
| longitude | DECIMAL(10,7) | NOT NULL |
| recorded_at | DATETIME | NOT NULL |

**FK:** trip_id → bus_trips.trip_id

### 4.11 arrival_predictions

Stores predicted arrival times.

| Column | Type | Constraints |
|---|---|---|
| prediction_id | BIGINT | PK, AUTO_INCREMENT |
| trip_id | BIGINT | FK, NOT NULL |
| stop_id | BIGINT | FK, NOT NULL |
| predicted_arrival | DATETIME | NOT NULL |
| prediction_time | DATETIME | NOT NULL |
| confidence_score | DECIMAL(5,2) | NULL |

**FKs:** trip_id → bus_trips.trip_id, stop_id → bus_stops.stop_id

### 4.12 arrival_history

Stores actual arrival data for prediction/history.

| Column | Type | Constraints |
|---|---|---|
| history_id | BIGINT | PK, AUTO_INCREMENT |
| trip_id | BIGINT | FK, NOT NULL |
| stop_id | BIGINT | FK, NOT NULL |
| scheduled_arrival | DATETIME | NULL |
| actual_arrival | DATETIME | NULL |
| delay_minutes | INT | NULL |
| recorded_at | DATETIME | NOT NULL |

### 4.13 favorite_stops

| Column | Type | Constraints |
|---|---|---|
| favorite_id | BIGINT | PK, AUTO_INCREMENT |
| passenger_id | BIGINT | FK, NOT NULL |
| stop_id | BIGINT | FK, NOT NULL |
| created_at | DATETIME | NOT NULL |

**Unique:** (passenger_id, stop_id)

### 4.14 favorite_routes

| Column | Type | Constraints |
|---|---|---|
| favorite_id | BIGINT | PK, AUTO_INCREMENT |
| passenger_id | BIGINT | FK, NOT NULL |
| route_id | BIGINT | FK, NOT NULL |
| created_at | DATETIME | NOT NULL |

**Unique:** (passenger_id, route_id)

### 4.15 notifications

| Column | Type | Constraints |
|---|---|---|
| notification_id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK, NOT NULL |
| title | VARCHAR(150) | NOT NULL |
| message | VARCHAR(500) | NOT NULL |
| type | ENUM | INFO, ALERT, REMINDER, SYSTEM |
| is_read | BOOLEAN | NOT NULL |
| created_at | DATETIME | NOT NULL |

**FK:** user_id → users.user_id

### 4.16 delay_reports

| Column | Type | Constraints |
|---|---|---|
| report_id | BIGINT | PK, AUTO_INCREMENT |
| trip_id | BIGINT | FK, NOT NULL |
| passenger_id | BIGINT | FK, NOT NULL |
| reason | VARCHAR(500) | NOT NULL |
| delay_minutes | INT | NULL |
| created_at | DATETIME | NOT NULL |

### 4.17 feedback

| Column | Type | Constraints |
|---|---|---|
| feedback_id | BIGINT | PK, AUTO_INCREMENT |
| trip_id | BIGINT | FK, NOT NULL |
| passenger_id | BIGINT | FK, NOT NULL |
| rating | INT | NOT NULL, 1–5 |
| comments | VARCHAR(1000) | NULL |
| created_at | DATETIME | NOT NULL |

### 4.18 audit_logs

| Column | Type | Constraints |
|---|---|---|
| log_id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK, NULL |
| action | VARCHAR(100) | NOT NULL |
| entity_type | VARCHAR(100) | NULL |
| entity_id | BIGINT | NULL |
| created_at | DATETIME | NOT NULL |

## 5. Relationships

| Parent | Child | Relationship |
|---|---|---|
| users | passengers | 1 : 1 |
| users | transport_operators | 1 : 1 |
| transport_operators | buses | 1 : N |
| bus_routes | route_stops | 1 : N |
| bus_stops | route_stops | 1 : N |
| bus_routes | bus_schedules | 1 : N |
| buses | bus_schedules | 1 : N |
| buses | bus_trips | 1 : N |
| bus_routes | bus_trips | 1 : N |
| bus_trips | bus_locations | 1 : N |
| bus_trips | arrival_predictions | 1 : N |
| bus_stops | arrival_predictions | 1 : N |
| bus_trips | arrival_history | 1 : N |
| bus_stops | arrival_history | 1 : N |
| passengers | favorite_stops | 1 : N |
| passengers | favorite_routes | 1 : N |
| users | notifications | 1 : N |
| passengers | delay_reports | 1 : N |
| passengers | feedback | 1 : N |
| users | audit_logs | 1 : N |

## 6. Main Database Flow

```
USERS
 ├── PASSENGERS
 │    ├── FAVORITE_STOPS ── BUS_STOPS
 │    ├── FAVORITE_ROUTES ─ BUS_ROUTES
 │    ├── DELAY_REPORTS ─── BUS_TRIPS
 │    └── FEEDBACK ──────── BUS_TRIPS
 │
 ├── TRANSPORT_OPERATORS
 │    └── BUSES
 │         └── BUS_TRIPS
 │              ├── BUS_LOCATIONS
 │              ├── ARRIVAL_PREDICTIONS ── BUS_STOPS
 │              └── ARRIVAL_HISTORY ────── BUS_STOPS
 │
 ├── NOTIFICATIONS
 └── AUDIT_LOGS

BUS_ROUTES
 ├── ROUTE_STOPS ── BUS_STOPS
 ├── BUS_SCHEDULES ── BUSES
 └── BUS_TRIPS
```

## 7. Important Constraints

1. **users.email** must be unique.
2. **buses.bus_number** must be unique.
3. A passenger cannot favorite the same stop twice.
4. A passenger cannot favorite the same route twice.
5. Feedback rating must be between 1 and 5.
6. Every bus belongs to one transport operator.
7. Every trip belongs to a bus and route.
8. Every prediction belongs to a trip and bus stop.
9. Foreign keys maintain referential integrity.

## 8. Recommended Indexes

- `users.email`
- `buses.bus_number`
- `bus_stops.stop_name`
- `bus_routes.route_name`
- `bus_trips.trip_date`
- `bus_trips.status`
- `bus_locations.trip_id, recorded_at`
- `arrival_predictions.trip_id, stop_id`
- `arrival_history.trip_id, stop_id`
- `notifications.user_id, is_read`

## 9. JPA Entity Structure

```
User
 ├── Passenger
 └── TransportOperator

TransportOperator
 └── Bus

Bus
 ├── BusSchedule
 └── BusTrip

BusRoute
 ├── RouteStop
 ├── BusSchedule
 └── BusTrip

BusStop
 └── RouteStop

BusTrip
 ├── BusLocation
 ├── ArrivalPrediction
 ├── ArrivalHistory
 ├── DelayReport
 └── Feedback
```

## 10. Summary

The database supports the complete SmartBus workflow:

```
Login
  ↓
Passenger / Operator
  ↓
Bus Management
  ↓
Route & Stop Management
  ↓
Schedule
  ↓
Trip
  ↓
Bus Location
  ↓
Arrival Prediction
  ↓
Notifications
  ↓
Feedback / Reports
  ↓
Admin & Audit
```
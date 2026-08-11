SmartBus – Smart Bus Stop Arrival Information Platform

## Title

SmartBus – Smart Bus Stop Arrival Information Platform

## Domain

Transportation Technology / Public Transport / Smart City

## Users

- **Passenger**: Searches buses and routes, views bus stops and schedules, checks estimated arrival times, saves favorite routes/stops, and receives notifications.
- **Transport Operator**: Manages buses, routes, stops, schedules, and bus movement information.
- **Admin**: Manages passengers, operators, buses, routes, stops, schedules, notifications, and platform activities.

## Problem Statement

Passengers often face difficulty knowing when a bus will arrive at a particular stop. Traditional bus schedules may not reflect delays caused by traffic, route conditions, or operational changes. This can result in long waiting times, uncertainty, and difficulty planning journeys.

Transport operators also need an efficient system to manage bus routes, stops, schedules, and arrival information.

SmartBus provides a centralized platform where passengers can discover bus information and receive estimated arrival times for their selected bus stops.

## Proposed Solution

The application will provide:

### For Passengers
- Passenger registration and login
- Passenger profile management
- Bus search
- Route search
- Bus stop search
- Bus and route details
- Bus stop details
- Bus schedules
- Estimated bus arrival time
- Favorite buses and bus stops
- Arrival notifications
- Delay/status updates

### For Transport Operators
- Transport operator management

### For System
- Bus management
- Route and stop management
- Schedule management
- Admin dashboard
- AI-powered bus arrival time prediction

## Core Entities / Database Tables

1. Users
2. Passengers
3. Transport Operators
4. Buses
5. Bus Routes
6. Bus Stops
7. Route Stops
8. Bus Schedules
9. Bus Trips
10. Bus Locations
11. Arrival Predictions
12. Favorite Stops
13. Favorite Routes
14. Notifications
15. Delay Reports
16. Feedback
17. Arrival History
18. Audit Logs

## User Roles & Permissions

| Role | Permissions |
|---|---|
| Passenger | Manage profile, search buses/routes/stops, view schedules, check arrival times, save favorites, and receive notifications |
| Transport Operator | Manage buses, routes, stops, schedules, trips, and bus movement information |

## Success Criteria

- [x] User can register and log in.
- [x] Passenger can create and manage a profile.
- [ ] Transport operator can create and manage bus details.
- [ ] Transport operator can create and manage bus routes.
- [ ] Transport operator can add and manage bus stops.
- [ ] Transport operator can configure bus schedules.
- [ ] Passenger can search for buses and routes.
- [ ] Passenger can view bus stop information.
- [ ] Passenger can view scheduled bus timings.
- [ ] Passenger can check the estimated arrival time of a bus.
- [ ] Passenger can save favorite routes and bus stops.
- [ ] Passenger can receive important arrival and delay notifications.
- [ ] System can record bus arrival and movement history.
- [ ] System can predict bus arrival time using historical and available travel data.
- [ ] Admin can monitor and manage the platform.

## Out of Scope

- Actual public bus ticket/payment processing
- Online ticket booking
- Salary and payroll management for drivers
- Driver attendance management
- Vehicle repair and maintenance management
- Automated traffic signal control
- Guaranteed real-time GPS accuracy
- Automated driving or vehicle control
- Emergency response management
- Government transport system integration
- Native Android/iOS applications
- Real-time video monitoring of buses
- Automated decisions affecting bus operations
- Fleet insurance management

## Chosen Track

Java – Spring Boot

## Technology Stack

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

## Current Status

- ✅ Project idea finalized
- ✅ Project name finalized
- ✅ Main workflow planned
- ✅ Core modules identified
- ✅ Database entities identified
- 🟡 ER diagram pending/finalization
- 🟡 Database implementation pending
- 🟡 Spring Boot backend pending
- 🟡 Authentication pending
- 🟡 Passenger module pending
- 🟡 Transport operator module pending
- 🟡 Bus management module pending
- 🟡 Route & bus stop module pending
- 🟡 Schedule module pending
- 🟡 Arrival prediction module pending
- 🟡 Notification system pending
- 🟡 Admin dashboard pending
- 🟡 AI prediction module pending
- 🟡 React frontend pending
- 🔴 Testing pending
- 🔴 Deployment pending

## Development Flow

```
Setup
  ↓
Database Design
  ↓
MySQL Database
  ↓
Spring Boot Backend
  ↓
Authentication & Authorization
  ↓
Passenger Module
  ↓
Transport Operator Module
  ↓
Bus Management Module
  ↓
Route & Bus Stop Module
  ↓
Schedule & Trip Module
  ↓
Bus Location & Arrival Information
  ↓
Notification System
  ↓
Admin Dashboard
  ↓
AI Bus Arrival Time Prediction
  ↓
React Frontend
  ↓
Testing
  ↓
CI/CD
  ↓
Deployment
```
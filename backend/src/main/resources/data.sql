-- SmartBus demo seed. Mirrors frontend mockData.js with relative timestamps.
-- Runs on every boot; INSERT IGNORE makes it idempotent.
-- Demo logins (all password: password): admin@smartbus.com / metro@smartbus.com / alex@smartbus.com

INSERT IGNORE INTO users (id, name, email, password_hash, role, active, phone, created_at) VALUES
  ('u1', 'Platform Admin', 'admin@smartbus.com', '$2a$10$jMJTjBQLAbN7SXnX9enq5OXtcf6m73uHIVffpA70ho3xfPjwdJ5N6', 'ADMIN', 1, '+1 555 0100', (CURDATE() - INTERVAL 120 DAY) + INTERVAL 10 HOUR),
  ('u2', 'Metro City Transit', 'metro@smartbus.com', '$2a$10$jMJTjBQLAbN7SXnX9enq5OXtcf6m73uHIVffpA70ho3xfPjwdJ5N6', 'OPERATOR', 1, '+1 555 0102', (CURDATE() - INTERVAL 90 DAY) + INTERVAL 10 HOUR),
  ('u3', 'Alex Chen', 'alex@smartbus.com', '$2a$10$jMJTjBQLAbN7SXnX9enq5OXtcf6m73uHIVffpA70ho3xfPjwdJ5N6', 'PASSENGER', 1, '+1 555 0103', (CURDATE() - INTERVAL 45 DAY) + INTERVAL 10 HOUR);

INSERT IGNORE INTO passengers (id, user_id, phone, created_at) VALUES
  ('p1', 'u3', '+1 555 0103', (CURDATE() - INTERVAL 45 DAY) + INTERVAL 10 HOUR);

INSERT IGNORE INTO transport_operators (id, user_id, organization_name, contact_number, created_at) VALUES
  ('op1', 'u2', 'Metro City Transit', '+1 555 0102', (CURDATE() - INTERVAL 90 DAY) + INTERVAL 10 HOUR);

INSERT IGNORE INTO buses (id, operator_id, bus_number, bus_type, capacity, status, created_at) VALUES
  ('b1', 'op1', 'MC-101', 'City Express', 60, 'ACTIVE', (CURDATE() - INTERVAL 80 DAY) + INTERVAL 10 HOUR),
  ('b2', 'op1', 'MC-102', 'City Express', 60, 'ACTIVE', (CURDATE() - INTERVAL 80 DAY) + INTERVAL 10 HOUR),
  ('b3', 'op1', 'MC-201', 'Standard', 45, 'ACTIVE', (CURDATE() - INTERVAL 75 DAY) + INTERVAL 10 HOUR),
  ('b4', 'op1', 'MC-202', 'Standard', 45, 'MAINTENANCE', (CURDATE() - INTERVAL 75 DAY) + INTERVAL 10 HOUR),
  ('b5', 'op1', 'MC-301', 'Mini Bus', 28, 'ACTIVE', (CURDATE() - INTERVAL 60 DAY) + INTERVAL 10 HOUR);

INSERT IGNORE INTO bus_routes (id, route_name, source, destination, status, created_at) VALUES
  ('r1', 'Airport Express', 'Central Station', 'City Airport', 'ACTIVE', (CURDATE() - INTERVAL 80 DAY) + INTERVAL 10 HOUR),
  ('r2', 'Green Line', 'Downtown Plaza', 'City Park', 'ACTIVE', (CURDATE() - INTERVAL 80 DAY) + INTERVAL 10 HOUR),
  ('r3', 'Riverside Loop', 'Harbor Walk', 'Harbor Walk', 'ACTIVE', (CURDATE() - INTERVAL 70 DAY) + INTERVAL 10 HOUR),
  ('r4', 'University Line', 'North Gate', 'University East', 'INACTIVE', (CURDATE() - INTERVAL 50 DAY) + INTERVAL 10 HOUR);

INSERT IGNORE INTO bus_stops (id, stop_name, latitude, longitude, address, created_at) VALUES
  ('s1', 'Central Station', 35.6895, 139.6917, '1 Chuo-dori, Central District', (CURDATE() - INTERVAL 80 DAY) + INTERVAL 10 HOUR),
  ('s2', 'Downtown Plaza', 35.6825, 139.6975, '12 Market Street', (CURDATE() - INTERVAL 80 DAY) + INTERVAL 10 HOUR),
  ('s3', 'Museum Quarter', 35.6740, 139.7020, '5 Museum Avenue', (CURDATE() - INTERVAL 80 DAY) + INTERVAL 10 HOUR),
  ('s4', 'City Airport', 35.6401, 139.7861, 'Airport Terminal Road', (CURDATE() - INTERVAL 80 DAY) + INTERVAL 10 HOUR),
  ('s5', 'Riverside Mall', 35.6955, 139.7105, '88 Riverside Drive', (CURDATE() - INTERVAL 70 DAY) + INTERVAL 10 HOUR),
  ('s6', 'City Park', 35.6877, 139.7202, 'Park Lane Entrance', (CURDATE() - INTERVAL 70 DAY) + INTERVAL 10 HOUR),
  ('s7', 'Harbor Walk', 35.6657, 139.7504, '2 Harborfront', (CURDATE() - INTERVAL 70 DAY) + INTERVAL 10 HOUR),
  ('s8', 'Old Town Square', 35.6921, 139.7011, 'Old Town', (CURDATE() - INTERVAL 65 DAY) + INTERVAL 10 HOUR),
  ('s9', 'North Gate', 35.7005, 139.6899, 'North Gate Station', (CURDATE() - INTERVAL 50 DAY) + INTERVAL 10 HOUR),
  ('s10', 'University East', 35.7032, 139.7033, 'University Campus', (CURDATE() - INTERVAL 50 DAY) + INTERVAL 10 HOUR);

INSERT IGNORE INTO route_stops (id, route_id, stop_id, stop_order, distance_km) VALUES
  ('rs1', 'r1', 's1', 1, 0),
  ('rs2', 'r1', 's2', 2, 1.8),
  ('rs3', 'r1', 's3', 3, 3.2),
  ('rs4', 'r1', 's4', 4, 9.5),
  ('rs5', 'r2', 's5', 1, 0),
  ('rs6', 'r2', 's6', 2, 2.4),
  ('rs7', 'r2', 's7', 3, 5.1),
  ('rs8', 'r3', 's7', 1, 0),
  ('rs9', 'r3', 's8', 2, 2.1),
  ('rs10', 'r3', 's1', 3, 4.3),
  ('rs11', 'r4', 's9', 1, 0),
  ('rs12', 'r4', 's10', 2, 3.0);

INSERT IGNORE INTO bus_schedules (id, route_id, bus_id, departure_time, arrival_time, days) VALUES
  ('sc1', 'r1', 'b1', '07:00', '07:40', 'DAILY'),
  ('sc2', 'r1', 'b2', '07:30', '08:10', 'DAILY'),
  ('sc3', 'r1', 'b1', '08:00', '08:40', 'MON-FRI'),
  ('sc4', 'r2', 'b3', '06:45', '07:25', 'MON-FRI'),
  ('sc5', 'r2', 'b3', '07:15', '07:55', 'MON-FRI'),
  ('sc6', 'r3', 'b5', '08:30', '09:05', 'WEEKEND');

INSERT IGNORE INTO bus_trips (id, bus_id, route_id, schedule_id, trip_date, start_time, end_time, status) VALUES
  ('t1', 'b1', 'r1', 'sc1', DATE_FORMAT(CURDATE(), '%Y-%m-%d'), NOW() - INTERVAL 12 MINUTE, NULL, 'ONGOING'),
  ('t2', 'b3', 'r2', 'sc4', DATE_FORMAT(CURDATE(), '%Y-%m-%d'), NOW() - INTERVAL 25 MINUTE, NULL, 'ONGOING'),
  ('t3', 'b2', 'r1', 'sc2', DATE_FORMAT(CURDATE(), '%Y-%m-%d'), NULL, NULL, 'SCHEDULED'),
  ('t4', 'b5', 'r3', 'sc6', DATE_FORMAT(CURDATE(), '%Y-%m-%d'), NOW() - INTERVAL 90 MINUTE, NOW() - INTERVAL 40 MINUTE, 'COMPLETED');

INSERT IGNORE INTO bus_locations (id, trip_id, latitude, longitude, recorded_at) VALUES
  ('l1', 't1', 35.6841, 139.6987, NOW() - INTERVAL 8 MINUTE),
  ('l2', 't1', 35.6812, 139.7001, NOW() - INTERVAL 4 MINUTE),
  ('l3', 't2', 35.6932, 139.7132, NOW() - INTERVAL 6 MINUTE);

INSERT IGNORE INTO arrival_predictions (id, trip_id, stop_id, predicted_arrival, prediction_time, confidence_score) VALUES
  ('pr1', 't1', 's1', NOW() - INTERVAL 10 MINUTE, NOW() - INTERVAL 12 MINUTE, 98.0),
  ('pr2', 't1', 's2', NOW() + INTERVAL 2 MINUTE, NOW() - INTERVAL 12 MINUTE, 95.0),
  ('pr3', 't1', 's3', NOW() + INTERVAL 9 MINUTE, NOW() - INTERVAL 12 MINUTE, 88.0),
  ('pr4', 't1', 's4', NOW() + INTERVAL 28 MINUTE, NOW() - INTERVAL 12 MINUTE, 76.0),
  ('pr5', 't2', 's5', NOW() - INTERVAL 15 MINUTE, NOW() - INTERVAL 20 MINUTE, 99.0),
  ('pr6', 't2', 's6', NOW() + INTERVAL 4 MINUTE, NOW() - INTERVAL 20 MINUTE, 93.0),
  ('pr7', 't2', 's7', NOW() + INTERVAL 19 MINUTE, NOW() - INTERVAL 20 MINUTE, 84.0);

INSERT IGNORE INTO favorite_stops (id, passenger_id, stop_id, created_at) VALUES
  ('f1', 'p1', 's1', NOW() - INTERVAL 10 DAY),
  ('f2', 'p1', 's6', NOW() - INTERVAL 3 DAY);

INSERT IGNORE INTO favorite_routes (id, passenger_id, route_id, created_at) VALUES
  ('fr1', 'p1', 'r1', NOW() - INTERVAL 6 DAY);

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, created_at) VALUES
  ('n1', 'u3', 'Bus 2 min away', 'MC-101 on Airport Express will arrive at Downtown Plaza in about 2 minutes.', 'REMINDER', 0, NOW() - INTERVAL 6 MINUTE),
  ('n2', 'u3', 'Schedule reminder', 'Your favorite route Airport Express departs Central Station at 08:00.', 'INFO', 0, NOW() - INTERVAL 40 MINUTE),
  ('n3', 'u3', 'Service update', 'University Line (North Gate) is temporarily inactive.', 'ALERT', 1, NOW() - INTERVAL 120 MINUTE),
  ('n4', 'u2', 'Movement recorded', 'Vehicle location recorded for trip t1 (MC-101).', 'SYSTEM', 1, NOW() - INTERVAL 4 MINUTE),
  ('n5', 'u1', 'New feedback', 'A passenger rated Airport Express trip with 4 stars.', 'INFO', 0, NOW() - INTERVAL 60 MINUTE);

INSERT IGNORE INTO delay_reports (id, trip_id, passenger_id, reason, delay_minutes, created_at) VALUES
  ('dr1', 't1', 'p1', 'Heavy traffic near Museum Quarter', 5, NOW() - INTERVAL 15 MINUTE);

INSERT IGNORE INTO feedback (id, trip_id, passenger_id, rating, comments, created_at) VALUES
  ('fb1', 't2', 'p1', 4, 'Smooth ride, arrived slightly early.', NOW() - INTERVAL 35 MINUTE),
  ('fb2', 't1', 'p1', 3, 'Predictions were accurate but bus was crowded.', NOW() - INTERVAL 70 MINUTE);

INSERT IGNORE INTO audit_logs (id, user_id, action, entity_type, entity_id, created_at) VALUES
  ('al1', 'u2', 'CREATE', 'BUS', 'b5', NOW() - INTERVAL 200 MINUTE),
  ('al2', 'u2', 'UPDATE', 'SCHEDULE', 'sc6', NOW() - INTERVAL 150 MINUTE),
  ('al3', 'u3', 'LOGIN', 'AUTH', NULL, NOW() - INTERVAL 45 MINUTE),
  ('al4', 'u1', 'UPDATE', 'USER', 'u3', NOW() - INTERVAL 30 MINUTE),
  ('al5', 'u2', 'RECORD_LOCATION', 'TRIP', 't1', NOW() - INTERVAL 4 MINUTE);

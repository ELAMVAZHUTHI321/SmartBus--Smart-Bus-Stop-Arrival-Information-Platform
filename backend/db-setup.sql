-- SmartBus database setup: run once as MySQL root.
-- Windows PowerShell:
--   & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -uroot -p < db-setup.sql
-- (You will be prompted for the root password.)

CREATE DATABASE IF NOT EXISTS smartbus
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'smartbus'@'localhost' IDENTIFIED BY 'SmartBus!dev2026';

GRANT ALL PRIVILEGES ON smartbus.* TO 'smartbus'@'localhost';

FLUSH PRIVILEGES;

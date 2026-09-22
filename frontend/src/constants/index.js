export const ROLES = {
  ADMIN: "ADMIN",
  OPERATOR: "OPERATOR",
  PASSENGER: "PASSENGER",
};

export const ROLE_LABELS = {
  ADMIN: "Admin",
  OPERATOR: "Transport Operator",
  PASSENGER: "Passenger",
};

export const BUS_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  MAINTENANCE: "MAINTENANCE",
};

export const ROUTE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const TRIP_STATUS = {
  SCHEDULED: "SCHEDULED",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const NOTIF_TYPE = {
  INFO: "INFO",
  ALERT: "ALERT",
  REMINDER: "REMINDER",
  SYSTEM: "SYSTEM",
};

export const DAY_OPTIONS = [
  { value: "DAILY", label: "Every day" },
  { value: "MON-FRI", label: "Weekdays" },
  { value: "WEEKEND", label: "Weekends" },
];

export const BUS_TYPES = ["Standard", "City Express", "Mini Bus", "Double Decker"];

export const HOME_PATHS = {
  ADMIN: "/admin",
  OPERATOR: "/operator",
  PASSENGER: "/",
};

export const STORAGE_KEYS = {
  TOKEN: "sb_token",
  USER: "sb_user",
};

export const DEMO_CREDENTIALS = [
  { label: "Passenger", email: "alex@smartbus.com", password: "password", role: ROLES.PASSENGER },
  { label: "Operator", email: "metro@smartbus.com", password: "password", role: ROLES.OPERATOR },
  { label: "Admin", email: "admin@smartbus.com", password: "password", role: ROLES.ADMIN },
];
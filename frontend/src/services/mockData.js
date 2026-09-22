const now = new Date();
const isoDaysAgo = (n, h = 10) =>
  new Date(now.getTime() - n * 86400000).setHours(h, 0, 0, 0);
const minsAgo = (n) => new Date(now.getTime() - n * 60000).toISOString();
const minsFromNow = (n) => new Date(now.getTime() + n * 60000).toISOString();

export const mockUsers = [
  {
    id: "u1",
    name: "Platform Admin",
    email: "admin@smartbus.com",
    password: "password",
    role: "ADMIN",
    active: true,
    phone: "+1 555 0100",
    createdAt: isoDaysAgo(120),
  },
  {
    id: "u2",
    name: "Metro City Transit",
    email: "metro@smartbus.com",
    password: "password",
    role: "OPERATOR",
    active: true,
    phone: "+1 555 0102",
    createdAt: isoDaysAgo(90),
  },
  {
    id: "u3",
    name: "Alex Chen",
    email: "alex@smartbus.com",
    password: "password",
    role: "PASSENGER",
    active: true,
    phone: "+1 555 0103",
    createdAt: isoDaysAgo(45),
  },
];

export const mockPassengers = [
  { id: "p1", userId: "u3", phone: "+1 555 0103", createdAt: isoDaysAgo(45) },
];

export const mockOperators = [
  {
    id: "op1",
    userId: "u2",
    organizationName: "Metro City Transit",
    contactNumber: "+1 555 0102",
    createdAt: isoDaysAgo(90),
  },
];

export const mockBuses = [
  { id: "b1", operatorId: "op1", busNumber: "MC-101", busType: "City Express", capacity: 60, status: "ACTIVE", createdAt: isoDaysAgo(80) },
  { id: "b2", operatorId: "op1", busNumber: "MC-102", busType: "City Express", capacity: 60, status: "ACTIVE", createdAt: isoDaysAgo(80) },
  { id: "b3", operatorId: "op1", busNumber: "MC-201", busType: "Standard", capacity: 45, status: "ACTIVE", createdAt: isoDaysAgo(75) },
  { id: "b4", operatorId: "op1", busNumber: "MC-202", busType: "Standard", capacity: 45, status: "MAINTENANCE", createdAt: isoDaysAgo(75) },
  { id: "b5", operatorId: "op1", busNumber: "MC-301", busType: "Mini Bus", capacity: 28, status: "ACTIVE", createdAt: isoDaysAgo(60) },
];

export const mockRoutes = [
  { id: "r1", routeName: "Airport Express", source: "Central Station", destination: "City Airport", status: "ACTIVE", createdAt: isoDaysAgo(80) },
  { id: "r2", routeName: "Green Line", source: "Downtown Plaza", destination: "City Park", status: "ACTIVE", createdAt: isoDaysAgo(80) },
  { id: "r3", routeName: "Riverside Loop", source: "Harbor Walk", destination: "Harbor Walk", status: "ACTIVE", createdAt: isoDaysAgo(70) },
  { id: "r4", routeName: "University Line", source: "North Gate", destination: "University East", status: "INACTIVE", createdAt: isoDaysAgo(50) },
];

export const mockStops = [
  { id: "s1", stopName: "Central Station", latitude: 35.6895, longitude: 139.6917, address: "1 Chuo-dori, Central District", createdAt: isoDaysAgo(80) },
  { id: "s2", stopName: "Downtown Plaza", latitude: 35.6825, longitude: 139.6975, address: "12 Market Street", createdAt: isoDaysAgo(80) },
  { id: "s3", stopName: "Museum Quarter", latitude: 35.674, longitude: 139.702, address: "5 Museum Avenue", createdAt: isoDaysAgo(80) },
  { id: "s4", stopName: "City Airport", latitude: 35.6401, longitude: 139.7861, address: "Airport Terminal Road", createdAt: isoDaysAgo(80) },
  { id: "s5", stopName: "Riverside Mall", latitude: 35.6955, longitude: 139.7105, address: "88 Riverside Drive", createdAt: isoDaysAgo(70) },
  { id: "s6", stopName: "City Park", latitude: 35.6877, longitude: 139.7202, address: "Park Lane Entrance", createdAt: isoDaysAgo(70) },
  { id: "s7", stopName: "Harbor Walk", latitude: 35.6657, longitude: 139.7504, address: "2 Harborfront", createdAt: isoDaysAgo(70) },
  { id: "s8", stopName: "Old Town Square", latitude: 35.6921, longitude: 139.7011, address: "Old Town", createdAt: isoDaysAgo(65) },
  { id: "s9", stopName: "North Gate", latitude: 35.7005, longitude: 139.6899, address: "North Gate Station", createdAt: isoDaysAgo(50) },
  { id: "s10", stopName: "University East", latitude: 35.7032, longitude: 139.7033, address: "University Campus", createdAt: isoDaysAgo(50) },
];

export const mockRouteStops = [
  { id: "rs1", routeId: "r1", stopId: "s1", stopOrder: 1, distanceKm: 0 },
  { id: "rs2", routeId: "r1", stopId: "s2", stopOrder: 2, distanceKm: 1.8 },
  { id: "rs3", routeId: "r1", stopId: "s3", stopOrder: 3, distanceKm: 3.2 },
  { id: "rs4", routeId: "r1", stopId: "s4", stopOrder: 4, distanceKm: 9.5 },
  { id: "rs5", routeId: "r2", stopId: "s5", stopOrder: 1, distanceKm: 0 },
  { id: "rs6", routeId: "r2", stopId: "s6", stopOrder: 2, distanceKm: 2.4 },
  { id: "rs7", routeId: "r2", stopId: "s7", stopOrder: 3, distanceKm: 5.1 },
  { id: "rs8", routeId: "r3", stopId: "s7", stopOrder: 1, distanceKm: 0 },
  { id: "rs9", routeId: "r3", stopId: "s8", stopOrder: 2, distanceKm: 2.1 },
  { id: "rs10", routeId: "r3", stopId: "s1", stopOrder: 3, distanceKm: 4.3 },
  { id: "rs11", routeId: "r4", stopId: "s9", stopOrder: 1, distanceKm: 0 },
  { id: "rs12", routeId: "r4", stopId: "s10", stopOrder: 2, distanceKm: 3.0 },
];

export const mockSchedules = [
  { id: "sc1", routeId: "r1", busId: "b1", departureTime: "07:00", arrivalTime: "07:40", days: "DAILY" },
  { id: "sc2", routeId: "r1", busId: "b2", departureTime: "07:30", arrivalTime: "08:10", days: "DAILY" },
  { id: "sc3", routeId: "r1", busId: "b1", departureTime: "08:00", arrivalTime: "08:40", days: "MON-FRI" },
  { id: "sc4", routeId: "r2", busId: "b3", departureTime: "06:45", arrivalTime: "07:25", days: "MON-FRI" },
  { id: "sc5", routeId: "r2", busId: "b3", departureTime: "07:15", arrivalTime: "07:55", days: "MON-FRI" },
  { id: "sc6", routeId: "r3", busId: "b5", departureTime: "08:30", arrivalTime: "09:05", days: "WEEKEND" },
];

const today = now.toISOString().slice(0, 10);
export const mockTrips = [
  {
    id: "t1",
    busId: "b1",
    routeId: "r1",
    scheduleId: "sc1",
    tripDate: today,
    startTime: minsAgo(12),
    endTime: null,
    status: "ONGOING",
  },
  {
    id: "t2",
    busId: "b3",
    routeId: "r2",
    scheduleId: "sc4",
    tripDate: today,
    startTime: minsAgo(25),
    endTime: null,
    status: "ONGOING",
  },
  {
    id: "t3",
    busId: "b2",
    routeId: "r1",
    scheduleId: "sc2",
    tripDate: today,
    startTime: null,
    endTime: null,
    status: "SCHEDULED",
  },
  {
    id: "t4",
    busId: "b5",
    routeId: "r3",
    scheduleId: "sc6",
    tripDate: today,
    startTime: minsAgo(90),
    endTime: minsAgo(40),
    status: "COMPLETED",
  },
];

export const mockBusLocations = [
  { id: "l1", tripId: "t1", latitude: 35.6841, longitude: 139.6987, recordedAt: minsAgo(8) },
  { id: "l2", tripId: "t1", latitude: 35.6812, longitude: 139.7001, recordedAt: minsAgo(4) },
  { id: "l3", tripId: "t2", latitude: 35.6932, longitude: 139.7132, recordedAt: minsAgo(6) },
];

export const mockPredictions = [
  { id: "pr1", tripId: "t1", stopId: "s1", predictedArrival: minsAgo(10), predictionTime: minsAgo(12), confidenceScore: 98.0 },
  { id: "pr2", tripId: "t1", stopId: "s2", predictedArrival: minsFromNow(2), predictionTime: minsAgo(12), confidenceScore: 95.0 },
  { id: "pr3", tripId: "t1", stopId: "s3", predictedArrival: minsFromNow(9), predictionTime: minsAgo(12), confidenceScore: 88.0 },
  { id: "pr4", tripId: "t1", stopId: "s4", predictedArrival: minsFromNow(28), predictionTime: minsAgo(12), confidenceScore: 76.0 },
  { id: "pr5", tripId: "t2", stopId: "s5", predictedArrival: minsAgo(15), predictionTime: minsAgo(20), confidenceScore: 99.0 },
  { id: "pr6", tripId: "t2", stopId: "s6", predictedArrival: minsFromNow(4), predictionTime: minsAgo(20), confidenceScore: 93.0 },
  { id: "pr7", tripId: "t2", stopId: "s7", predictedArrival: minsFromNow(19), predictionTime: minsAgo(20), confidenceScore: 84.0 },
];

export const mockFavoriteStops = [
  { id: "f1", passengerId: "p1", stopId: "s1", createdAt: isoDaysAgo(10) },
  { id: "f2", passengerId: "p1", stopId: "s6", createdAt: isoDaysAgo(3) },
];

export const mockFavoriteRoutes = [
  { id: "fr1", passengerId: "p1", routeId: "r1", createdAt: isoDaysAgo(6) },
];

export const mockNotifications = [
  { id: "n1", userId: "u3", title: "Bus 2 min away", message: "MC-101 on Airport Express will arrive at Downtown Plaza in about 2 minutes.", type: "REMINDER", isRead: false, createdAt: minsAgo(6) },
  { id: "n2", userId: "u3", title: "Schedule reminder", message: "Your favorite route Airport Express departs Central Station at 08:00.", type: "INFO", isRead: false, createdAt: minsAgo(40) },
  { id: "n3", userId: "u3", title: "Service update", message: "University Line (North Gate) is temporarily inactive.", type: "ALERT", isRead: true, createdAt: minsAgo(120) },
  { id: "n4", userId: "u2", title: "Movement recorded", message: "Vehicle location recorded for trip t1 (MC-101).", type: "SYSTEM", isRead: true, createdAt: minsAgo(4) },
  { id: "n5", userId: "u1", title: "New feedback", message: "A passenger rated Airport Express trip with 4 stars.", type: "INFO", isRead: false, createdAt: minsAgo(60) },
];

export const mockDelayReports = [
  { id: "dr1", tripId: "t1", passengerId: "p1", reason: "Heavy traffic near Museum Quarter", delayMinutes: 5, createdAt: minsAgo(15) },
];

export const mockFeedback = [
  { id: "fb1", tripId: "t2", passengerId: "p1", rating: 4, comments: "Smooth ride, arrived slightly early.", createdAt: minsAgo(35) },
  { id: "fb2", tripId: "t1", passengerId: "p1", rating: 3, comments: "Predictions were accurate but bus was crowded.", createdAt: minsAgo(70) },
];

export const mockAuditLogs = [
  { id: "al1", userId: "u2", action: "CREATE", entityType: "BUS", entityId: "b5", createdAt: minsAgo(200) },
  { id: "al2", userId: "u2", action: "UPDATE", entityType: "SCHEDULE", entityId: "sc6", createdAt: minsAgo(150) },
  { id: "al3", userId: "u3", action: "LOGIN", entityType: "AUTH", entityId: null, createdAt: minsAgo(45) },
  { id: "al4", userId: "u1", action: "UPDATE", entityType: "USER", entityId: "u3", createdAt: minsAgo(30) },
  { id: "al5", userId: "u2", action: "RECORD_LOCATION", entityType: "TRIP", entityId: "t1", createdAt: minsAgo(4) },
];
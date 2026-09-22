package com.smartbus.service;

import com.smartbus.dto.SafeUser;
import com.smartbus.entity.Bus;
import com.smartbus.entity.BusRoute;
import com.smartbus.entity.BusTrip;
import com.smartbus.entity.Feedback;
import com.smartbus.entity.Role;
import com.smartbus.entity.TransportOperator;
import com.smartbus.entity.TripStatus;
import com.smartbus.entity.User;
import com.smartbus.exception.ApiException;
import com.smartbus.repository.AuditLogRepository;
import com.smartbus.repository.BusRepository;
import com.smartbus.repository.BusRouteRepository;
import com.smartbus.repository.BusScheduleRepository;
import com.smartbus.repository.BusStopRepository;
import com.smartbus.repository.BusTripRepository;
import com.smartbus.repository.DelayReportRepository;
import com.smartbus.repository.FeedbackRepository;
import com.smartbus.repository.NotificationRepository;
import com.smartbus.repository.PassengerRepository;
import com.smartbus.repository.TransportOperatorRepository;
import com.smartbus.repository.UserRepository;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {
  private final UserRepository userRepository;
  private final PassengerRepository passengerRepository;
  private final TransportOperatorRepository operatorRepository;
  private final BusRepository busRepository;
  private final BusRouteRepository routeRepository;
  private final BusStopRepository stopRepository;
  private final BusScheduleRepository scheduleRepository;
  private final BusTripRepository tripRepository;
  private final NotificationRepository notificationRepository;
  private final DelayReportRepository delayReportRepository;
  private final FeedbackRepository feedbackRepository;
  private final AuditLogRepository auditLogRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuditService auditService;

  public AdminService(UserRepository userRepository, PassengerRepository passengerRepository,
      TransportOperatorRepository operatorRepository, BusRepository busRepository,
      BusRouteRepository routeRepository, BusStopRepository stopRepository,
      BusScheduleRepository scheduleRepository, BusTripRepository tripRepository,
      NotificationRepository notificationRepository, DelayReportRepository delayReportRepository,
      FeedbackRepository feedbackRepository, AuditLogRepository auditLogRepository,
      PasswordEncoder passwordEncoder, AuditService auditService) {
    this.userRepository = userRepository;
    this.passengerRepository = passengerRepository;
    this.operatorRepository = operatorRepository;
    this.busRepository = busRepository;
    this.routeRepository = routeRepository;
    this.stopRepository = stopRepository;
    this.scheduleRepository = scheduleRepository;
    this.tripRepository = tripRepository;
    this.notificationRepository = notificationRepository;
    this.delayReportRepository = delayReportRepository;
    this.feedbackRepository = feedbackRepository;
    this.auditLogRepository = auditLogRepository;
    this.passwordEncoder = passwordEncoder;
    this.auditService = auditService;
  }

  public Map<String, Object> stats() {
    String today = LocalDate.now().toString();
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("users", userRepository.count());
    m.put("passengers", passengerRepository.count());
    m.put("operators", operatorRepository.count());
    m.put("admins", userRepository.countByRole(Role.ADMIN));
    m.put("buses", busRepository.count());
    m.put("activeBuses", busRepository.countByStatus(com.smartbus.entity.BusStatus.ACTIVE));
    m.put("routes", routeRepository.count());
    m.put("activeRoutes", routeRepository.countByStatus(com.smartbus.entity.RouteStatus.ACTIVE));
    m.put("stops", stopRepository.count());
    m.put("schedules", scheduleRepository.count());
    m.put("tripsToday", tripRepository.countByTripDate(today));
    m.put("ongoingTrips", tripRepository.countByStatus(TripStatus.ONGOING));
    m.put("feedback", feedbackRepository.count());
    m.put("delayReports", delayReportRepository.count());
    m.put("notifications", notificationRepository.count());
    m.put("avgRating", Math.round(feedbackRepository.averageRating() * 10.0) / 10.0);
    return m;
  }

  public List<SafeUser> listUsers() {
    return userRepository.findAll().stream().map(SafeUser::from).collect(Collectors.toList());
  }

  @Transactional
  public SafeUser updateUser(String userId, Map<String, Object> patch) {
    User u = userRepository.findById(userId)
        .orElseThrow(() -> ApiException.notFound("User not found."));
    if (patch.containsKey("name") && patch.get("name") != null) u.setName(String.valueOf(patch.get("name")));
    if (patch.containsKey("email") && patch.get("email") != null) {
      String email = String.valueOf(patch.get("email")).trim().toLowerCase();
      if (!email.equals(u.getEmail()) && userRepository.existsByEmail(email)) {
        throw ApiException.badRequest("Email is already registered.");
      }
      u.setEmail(email);
    }
    if (patch.containsKey("role") && patch.get("role") != null) {
      try {
        u.setRole(Role.valueOf(String.valueOf(patch.get("role")).trim().toUpperCase()));
      } catch (IllegalArgumentException e) {
        throw ApiException.badRequest("Invalid role.");
      }
    }
    if (patch.containsKey("active") && patch.get("active") != null) {
      u.setActive(Boolean.parseBoolean(String.valueOf(patch.get("active"))));
    }
    userRepository.save(u);
    auditService.log(AuthService.currentUserId(), "UPDATE", "USER", u.getId());
    return SafeUser.from(u);
  }

  public List<Map<String, Object>> listOperators() {
    return operatorRepository.findAll().stream().map(o -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("id", o.getId());
      m.put("userId", o.getUserId());
      m.put("organizationName", o.getOrganizationName());
      m.put("contactNumber", o.getContactNumber());
      m.put("createdAt", o.getCreatedAt() == null ? null : o.getCreatedAt().toString());
      User u = userRepository.findById(o.getUserId()).orElse(null);
      if (u == null) {
        m.put("user", null);
      } else {
        Map<String, Object> um = new LinkedHashMap<>();
        um.put("id", u.getId());
        um.put("name", u.getName());
        um.put("email", u.getEmail());
        um.put("role", u.getRole().name());
        um.put("active", u.isActive());
        m.put("user", um);
      }
      m.put("busCount", busRepository.findByOperatorId(o.getId()).size());
      m.put("routeCount", 0);
      return m;
    }).collect(Collectors.toList());
  }

  @Transactional
  public Map<String, Object> createOperator(Map<String, Object> data) {
    String name = data.get("name") == null ? null : String.valueOf(data.get("name")).trim();
    String email = data.get("email") == null ? null : String.valueOf(data.get("email")).trim().toLowerCase();
    if (name == null || name.isEmpty() || email == null || email.isEmpty()) {
      throw ApiException.badRequest("name and email are required.");
    }
    if (userRepository.existsByEmail(email)) throw ApiException.badRequest("Email is already registered.");
    Object org = data.get("organizationName");
    if (org == null || String.valueOf(org).isBlank()) throw ApiException.badRequest("organizationName is required.");
    Object pw = data.get("password");
    String password = (pw == null || String.valueOf(pw).isEmpty()) ? "password" : String.valueOf(pw);

    User u = new User();
    u.setName(name);
    u.setEmail(email);
    u.setPasswordHash(passwordEncoder.encode(password));
    u.setRole(Role.OPERATOR);
    u.setActive(true);
    Object contact = data.get("contactNumber");
    u.setPhone(contact == null ? null : String.valueOf(contact));
    userRepository.save(u);

    TransportOperator o = new TransportOperator();
    o.setUserId(u.getId());
    o.setOrganizationName(String.valueOf(org));
    o.setContactNumber(contact == null ? null : String.valueOf(contact));
    operatorRepository.save(o);
    auditService.log(AuthService.currentUserId(), "CREATE", "OPERATOR", o.getId());

    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", o.getId());
    m.put("userId", o.getUserId());
    m.put("organizationName", o.getOrganizationName());
    m.put("contactNumber", o.getContactNumber());
    Map<String, Object> um = new LinkedHashMap<>();
    um.put("id", u.getId());
    um.put("name", u.getName());
    um.put("email", u.getEmail());
    um.put("role", u.getRole().name());
    um.put("active", u.isActive());
    m.put("user", um);
    m.put("busCount", 0);
    m.put("routeCount", 0);
    return m;
  }

  public List<Map<String, Object>> auditLogs() {
    return auditLogRepository.findAllByOrderByCreatedAtDesc().stream().map(a -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("id", a.getId());
      m.put("userId", a.getUserId());
      m.put("action", a.getAction());
      m.put("entityType", a.getEntityType());
      m.put("entityId", a.getEntityId());
      m.put("createdAt", a.getCreatedAt() == null ? null : a.getCreatedAt().toString());
      String actorName = "System";
      if (a.getUserId() != null) {
        actorName = userRepository.findById(a.getUserId()).map(User::getName).orElse("System");
      }
      m.put("actorName", actorName);
      return m;
    }).collect(Collectors.toList());
  }

  public List<Map<String, Object>> feedback() {
    List<Feedback> all = feedbackRepository.findAll();
    all.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
    return all.stream().map(f -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("id", f.getId());
      m.put("tripId", f.getTripId());
      m.put("passengerId", f.getPassengerId());
      m.put("rating", f.getRating());
      m.put("comments", f.getComments());
      m.put("createdAt", f.getCreatedAt() == null ? null : f.getCreatedAt().toString());
      String passengerName = passengerRepository.findById(f.getPassengerId())
          .flatMap(p -> userRepository.findById(p.getUserId())).map(User::getName).orElse(null);
      m.put("passengerName", passengerName);
      BusTrip trip = tripRepository.findById(f.getTripId()).orElse(null);
      String tripLabel = "-";
      if (trip != null) {
        String busNumber = busRepository.findById(trip.getBusId()).map(Bus::getBusNumber).orElse("");
        String routeName = routeRepository.findById(trip.getRouteId()).map(BusRoute::getRouteName).orElse("");
        tripLabel = (busNumber + " " + routeName).trim();
        if (tripLabel.isEmpty()) tripLabel = "-";
      }
      m.put("tripLabel", tripLabel);
      return m;
    }).collect(Collectors.toList());
  }

  public List<Map<String, Object>> delayReports() {
    return delayReportRepository.findAll().stream().map(d -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("id", d.getId());
      m.put("tripId", d.getTripId());
      m.put("passengerId", d.getPassengerId());
      m.put("reason", d.getReason());
      m.put("delayMinutes", d.getDelayMinutes());
      m.put("createdAt", d.getCreatedAt() == null ? null : d.getCreatedAt().toString());
      return m;
    }).collect(Collectors.toList());
  }

}

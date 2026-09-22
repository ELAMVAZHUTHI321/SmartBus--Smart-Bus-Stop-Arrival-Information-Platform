package com.smartbus.service;

import com.smartbus.entity.Bus;
import com.smartbus.entity.BusRoute;
import com.smartbus.entity.BusSchedule;
import com.smartbus.exception.ApiException;
import com.smartbus.repository.BusRepository;
import com.smartbus.repository.BusRouteRepository;
import com.smartbus.repository.BusScheduleRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScheduleService {
  private final BusScheduleRepository scheduleRepository;
  private final BusRouteRepository routeRepository;
  private final BusRepository busRepository;
  private final AuditService auditService;

  public ScheduleService(BusScheduleRepository scheduleRepository, BusRouteRepository routeRepository,
      BusRepository busRepository, AuditService auditService) {
    this.scheduleRepository = scheduleRepository;
    this.routeRepository = routeRepository;
    this.busRepository = busRepository;
    this.auditService = auditService;
  }

  public Map<String, Object> decorate(BusSchedule s) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", s.getId());
    m.put("routeId", s.getRouteId());
    m.put("busId", s.getBusId());
    m.put("departureTime", s.getDepartureTime());
    m.put("arrivalTime", s.getArrivalTime());
    m.put("days", s.getDays());
    m.put("routeName", routeRepository.findById(s.getRouteId()).map(BusRoute::getRouteName).orElse(null));
    m.put("busNumber", busRepository.findById(s.getBusId()).map(Bus::getBusNumber).orElse(null));
    return m;
  }

  public List<Map<String, Object>> list() {
    return scheduleRepository.findAll().stream().map(this::decorate).collect(Collectors.toList());
  }

  public List<Map<String, Object>> forRoute(String routeId) {
    return scheduleRepository.findByRouteId(routeId).stream().map(this::decorate).collect(Collectors.toList());
  }

  @Transactional
  public Map<String, Object> create(Map<String, Object> data) {
    BusSchedule s = new BusSchedule();
    s.setRouteId(data.get("routeId") == null ? null : String.valueOf(data.get("routeId")));
    s.setBusId(data.get("busId") == null ? null : String.valueOf(data.get("busId")));
    s.setDepartureTime(data.get("departureTime") == null ? null : String.valueOf(data.get("departureTime")));
    s.setArrivalTime(data.get("arrivalTime") == null ? null : String.valueOf(data.get("arrivalTime")));
    s.setDays(data.get("days") == null ? null : String.valueOf(data.get("days")));
    if (s.getRouteId() == null || s.getBusId() == null) {
      throw ApiException.badRequest("routeId and busId are required.");
    }
    scheduleRepository.save(s);
    auditService.log(AuthService.currentUserId(), "CREATE", "SCHEDULE", s.getId());
    return decorate(s);
  }

  @Transactional
  public Map<String, Object> update(String id, Map<String, Object> data) {
    BusSchedule s = scheduleRepository.findById(id)
        .orElseThrow(() -> ApiException.notFound("Schedule not found."));
    if (data.containsKey("routeId") && data.get("routeId") != null) s.setRouteId(String.valueOf(data.get("routeId")));
    if (data.containsKey("busId") && data.get("busId") != null) s.setBusId(String.valueOf(data.get("busId")));
    if (data.containsKey("departureTime")) {
      Object v = data.get("departureTime");
      s.setDepartureTime(v == null ? null : String.valueOf(v));
    }
    if (data.containsKey("arrivalTime")) {
      Object v = data.get("arrivalTime");
      s.setArrivalTime(v == null ? null : String.valueOf(v));
    }
    if (data.containsKey("days")) {
      Object v = data.get("days");
      s.setDays(v == null ? null : String.valueOf(v));
    }
    scheduleRepository.save(s);
    auditService.log(AuthService.currentUserId(), "UPDATE", "SCHEDULE", s.getId());
    return decorate(s);
  }

  @Transactional
  public Map<String, Object> remove(String id) {
    BusSchedule s = scheduleRepository.findById(id)
        .orElseThrow(() -> ApiException.notFound("Schedule not found."));
    scheduleRepository.delete(s);
    auditService.log(AuthService.currentUserId(), "DELETE", "SCHEDULE", id);
    return Map.of("ok", true);
  }
}

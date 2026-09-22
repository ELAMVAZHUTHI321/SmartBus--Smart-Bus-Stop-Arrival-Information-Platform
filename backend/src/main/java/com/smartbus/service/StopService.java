package com.smartbus.service;

import com.smartbus.entity.BusRoute;
import com.smartbus.entity.BusStop;
import com.smartbus.entity.RouteStop;
import com.smartbus.exception.ApiException;
import com.smartbus.repository.BusRouteRepository;
import com.smartbus.repository.BusStopRepository;
import com.smartbus.repository.RouteStopRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StopService {
  private final BusStopRepository stopRepository;
  private final RouteStopRepository routeStopRepository;
  private final BusRouteRepository routeRepository;
  private final AuditService auditService;

  public StopService(BusStopRepository stopRepository, RouteStopRepository routeStopRepository,
      BusRouteRepository routeRepository, AuditService auditService) {
    this.stopRepository = stopRepository;
    this.routeStopRepository = routeStopRepository;
    this.routeRepository = routeRepository;
    this.auditService = auditService;
  }

  public static Map<String, Object> decorateStatic(BusStop s) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", s.getId());
    m.put("stopName", s.getStopName());
    m.put("latitude", s.getLatitude());
    m.put("longitude", s.getLongitude());
    m.put("address", s.getAddress());
    m.put("createdAt", s.getCreatedAt() == null ? null : s.getCreatedAt().toString());
    return m;
  }

  public List<Map<String, Object>> list() {
    return stopRepository.findAll().stream().map(StopService::decorateStatic).collect(Collectors.toList());
  }

  public Map<String, Object> getById(String id) {
    BusStop s = stopRepository.findById(id).orElseThrow(() -> ApiException.notFound("Stop not found."));
    return decorateStatic(s);
  }

  @Transactional
  public Map<String, Object> create(Map<String, Object> data) {
    String name = data.get("stopName") == null ? null : String.valueOf(data.get("stopName")).trim();
    if (name == null || name.isEmpty()) throw ApiException.badRequest("Stop name is required.");
    BusStop s = new BusStop();
    s.setStopName(name);
    s.setLatitude(BusService.toDouble(data.get("latitude")));
    s.setLongitude(BusService.toDouble(data.get("longitude")));
    s.setAddress(data.get("address") == null ? null : String.valueOf(data.get("address")));
    stopRepository.save(s);
    auditService.log(AuthService.currentUserId(), "CREATE", "STOP", s.getId());
    return decorateStatic(s);
  }

  @Transactional
  public Map<String, Object> update(String id, Map<String, Object> data) {
    BusStop s = stopRepository.findById(id).orElseThrow(() -> ApiException.notFound("Stop not found."));
    if (data.containsKey("stopName") && data.get("stopName") != null) {
      s.setStopName(String.valueOf(data.get("stopName")).trim());
    }
    if (data.containsKey("latitude")) s.setLatitude(BusService.toDouble(data.get("latitude")));
    if (data.containsKey("longitude")) s.setLongitude(BusService.toDouble(data.get("longitude")));
    if (data.containsKey("address")) {
      Object v = data.get("address");
      s.setAddress(v == null ? null : String.valueOf(v));
    }
    stopRepository.save(s);
    auditService.log(AuthService.currentUserId(), "UPDATE", "STOP", s.getId());
    return decorateStatic(s);
  }

  @Transactional
  public Map<String, Object> remove(String id) {
    BusStop s = stopRepository.findById(id).orElseThrow(() -> ApiException.notFound("Stop not found."));
    stopRepository.delete(s);
    auditService.log(AuthService.currentUserId(), "DELETE", "STOP", id);
    return Map.of("ok", true);
  }

  public List<Map<String, Object>> routesForStop(String stopId) {
    List<String> routeIds = routeStopRepository.findByStopId(stopId).stream()
        .map(RouteStop::getRouteId).distinct().collect(Collectors.toList());
    return routeRepository.findAllById(routeIds).stream().map(r -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("id", r.getId());
      m.put("routeName", r.getRouteName());
      m.put("source", r.getSource());
      m.put("destination", r.getDestination());
      m.put("status", r.getStatus().name());
      return m;
    }).collect(Collectors.toList());
  }

  public BusRoute requireRoute(String routeId) {
    return routeRepository.findById(routeId).orElse(null);
  }
}

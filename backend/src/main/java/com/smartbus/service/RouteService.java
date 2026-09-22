package com.smartbus.service;

import com.smartbus.entity.BusRoute;
import com.smartbus.entity.BusStop;
import com.smartbus.entity.RouteStatus;
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
public class RouteService {
  private final BusRouteRepository routeRepository;
  private final RouteStopRepository routeStopRepository;
  private final BusStopRepository stopRepository;
  private final AuditService auditService;

  public RouteService(BusRouteRepository routeRepository, RouteStopRepository routeStopRepository,
      BusStopRepository stopRepository, AuditService auditService) {
    this.routeRepository = routeRepository;
    this.routeStopRepository = routeStopRepository;
    this.stopRepository = stopRepository;
    this.auditService = auditService;
  }

  public Map<String, Object> decorate(BusRoute r) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", r.getId());
    m.put("routeName", r.getRouteName());
    m.put("source", r.getSource());
    m.put("destination", r.getDestination());
    m.put("status", r.getStatus().name());
    m.put("createdAt", r.getCreatedAt() == null ? null : r.getCreatedAt().toString());
    return m;
  }

  private RouteStatus parseStatus(Object v) {
    if (v == null) return RouteStatus.ACTIVE;
    try {
      return RouteStatus.valueOf(String.valueOf(v).trim().toUpperCase());
    } catch (IllegalArgumentException e) {
      throw ApiException.badRequest("Invalid route status.");
    }
  }

  public List<Map<String, Object>> list() {
    return routeRepository.findAll().stream().map(this::decorate).collect(Collectors.toList());
  }

  public Map<String, Object> getById(String id) {
    BusRoute r = routeRepository.findById(id).orElseThrow(() -> ApiException.notFound("Route not found."));
    return decorate(r);
  }

  @Transactional
  public Map<String, Object> create(Map<String, Object> data) {
    String name = data.get("routeName") == null ? null : String.valueOf(data.get("routeName")).trim();
    if (name == null || name.isEmpty()) throw ApiException.badRequest("Route name is required.");
    if (routeRepository.existsByRouteName(name)) throw ApiException.badRequest("Route name already exists.");
    BusRoute r = new BusRoute();
    r.setRouteName(name);
    r.setSource(data.get("source") == null ? null : String.valueOf(data.get("source")));
    r.setDestination(data.get("destination") == null ? null : String.valueOf(data.get("destination")));
    r.setStatus(parseStatus(data.get("status")));
    routeRepository.save(r);
    auditService.log(AuthService.currentUserId(), "CREATE", "ROUTE", r.getId());
    return decorate(r);
  }

  @Transactional
  public Map<String, Object> update(String id, Map<String, Object> data) {
    BusRoute r = routeRepository.findById(id).orElseThrow(() -> ApiException.notFound("Route not found."));
    if (data.containsKey("routeName") && data.get("routeName") != null) {
      String n = String.valueOf(data.get("routeName")).trim();
      if (!n.equals(r.getRouteName()) && routeRepository.existsByRouteName(n)) {
        throw ApiException.badRequest("Route name already exists.");
      }
      r.setRouteName(n);
    }
    if (data.containsKey("source")) r.setSource(data.get("source") == null ? null : String.valueOf(data.get("source")));
    if (data.containsKey("destination")) r.setDestination(data.get("destination") == null ? null : String.valueOf(data.get("destination")));
    if (data.containsKey("status")) r.setStatus(parseStatus(data.get("status")));
    routeRepository.save(r);
    auditService.log(AuthService.currentUserId(), "UPDATE", "ROUTE", r.getId());
    return decorate(r);
  }

  @Transactional
  public Map<String, Object> remove(String id) {
    BusRoute r = routeRepository.findById(id).orElseThrow(() -> ApiException.notFound("Route not found."));
    routeRepository.delete(r);
    auditService.log(AuthService.currentUserId(), "DELETE", "ROUTE", id);
    return Map.of("ok", true);
  }

  public List<Map<String, Object>> stopsForRoute(String routeId) {
    return routeStopRepository.findByRouteIdOrderByStopOrderAsc(routeId).stream().map(rs -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("id", rs.getId());
      m.put("routeId", rs.getRouteId());
      m.put("stopId", rs.getStopId());
      m.put("stopOrder", rs.getStopOrder());
      m.put("distanceKm", rs.getDistanceKm());
      BusStop stop = stopRepository.findById(rs.getStopId()).orElse(null);
      m.put("stop", stop == null ? null : StopService.decorateStatic(stop));
      return m;
    }).collect(Collectors.toList());
  }
}

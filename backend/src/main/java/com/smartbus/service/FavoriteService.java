package com.smartbus.service;

import com.smartbus.entity.BusRoute;
import com.smartbus.entity.BusStop;
import com.smartbus.entity.FavoriteRoute;
import com.smartbus.entity.FavoriteStop;
import com.smartbus.exception.ApiException;
import com.smartbus.repository.BusRouteRepository;
import com.smartbus.repository.BusStopRepository;
import com.smartbus.repository.FavoriteRouteRepository;
import com.smartbus.repository.FavoriteStopRepository;
import com.smartbus.repository.PassengerRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {
  private final FavoriteStopRepository favoriteStopRepository;
  private final FavoriteRouteRepository favoriteRouteRepository;
  private final PassengerRepository passengerRepository;
  private final BusStopRepository stopRepository;
  private final BusRouteRepository routeRepository;

  public FavoriteService(FavoriteStopRepository favoriteStopRepository,
      FavoriteRouteRepository favoriteRouteRepository, PassengerRepository passengerRepository,
      BusStopRepository stopRepository, BusRouteRepository routeRepository) {
    this.favoriteStopRepository = favoriteStopRepository;
    this.favoriteRouteRepository = favoriteRouteRepository;
    this.passengerRepository = passengerRepository;
    this.stopRepository = stopRepository;
    this.routeRepository = routeRepository;
  }

  private String passengerIdFor(String userId) {
    return passengerRepository.findByUserId(userId).map(p -> p.getId()).orElse(null);
  }

  private void checkOwner(String userId) {
    String me = AuthService.currentUserId();
    if (me == null || (!me.equals(userId) && !AuthService.currentHasRole("ADMIN"))) {
      throw ApiException.forbidden("You can only manage your own favorites.");
    }
  }

  public List<Map<String, Object>> listStops(String userId) {
    checkOwner(userId);
    String pid = passengerIdFor(userId);
    if (pid == null) return List.of();
    return favoriteStopRepository.findByPassengerId(pid).stream().map(f -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("id", f.getId());
      m.put("stopId", f.getStopId());
      BusStop stop = stopRepository.findById(f.getStopId()).orElse(null);
      m.put("stop", stop == null ? null : StopService.decorateStatic(stop));
      return m;
    }).collect(Collectors.toList());
  }

  public List<Map<String, Object>> listRoutes(String userId) {
    checkOwner(userId);
    String pid = passengerIdFor(userId);
    if (pid == null) return List.of();
    return favoriteRouteRepository.findByPassengerId(pid).stream().map(f -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("id", f.getId());
      m.put("routeId", f.getRouteId());
      BusRoute r = routeRepository.findById(f.getRouteId()).orElse(null);
      if (r == null) {
        m.put("route", null);
      } else {
        Map<String, Object> rm = new LinkedHashMap<>();
        rm.put("id", r.getId());
        rm.put("routeName", r.getRouteName());
        rm.put("source", r.getSource());
        rm.put("destination", r.getDestination());
        rm.put("status", r.getStatus().name());
        m.put("route", rm);
      }
      return m;
    }).collect(Collectors.toList());
  }

  @Transactional
  public Map<String, Object> addStop(String userId, Map<String, Object> body) {
    checkOwner(userId);
    String pid = passengerRepository.findByUserId(userId)
        .orElseThrow(() -> ApiException.badRequest("Passenger profile not found.")).getId();
    String stopId = body == null || body.get("stopId") == null ? null : String.valueOf(body.get("stopId"));
    if (stopId == null) throw ApiException.badRequest("stopId is required.");
    stopRepository.findById(stopId).orElseThrow(() -> ApiException.notFound("Stop not found."));
    if (favoriteStopRepository.findByPassengerIdAndStopId(pid, stopId).isPresent()) {
      return Map.of("alreadyFavorite", true);
    }
    FavoriteStop f = new FavoriteStop();
    f.setPassengerId(pid);
    f.setStopId(stopId);
    favoriteStopRepository.save(f);
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", f.getId());
    m.put("stopId", f.getStopId());
    return m;
  }

  @Transactional
  public Map<String, Object> removeStop(String userId, String stopId) {
    checkOwner(userId);
    String pid = passengerIdFor(userId);
    if (pid != null) favoriteStopRepository.deleteByPassengerIdAndStopId(pid, stopId);
    return Map.of("ok", true);
  }

  @Transactional
  public Map<String, Object> addRoute(String userId, Map<String, Object> body) {
    checkOwner(userId);
    String pid = passengerRepository.findByUserId(userId)
        .orElseThrow(() -> ApiException.badRequest("Passenger profile not found.")).getId();
    String routeId = body == null || body.get("routeId") == null ? null : String.valueOf(body.get("routeId"));
    if (routeId == null) throw ApiException.badRequest("routeId is required.");
    routeRepository.findById(routeId).orElseThrow(() -> ApiException.notFound("Route not found."));
    if (favoriteRouteRepository.findByPassengerIdAndRouteId(pid, routeId).isPresent()) {
      return Map.of("alreadyFavorite", true);
    }
    FavoriteRoute f = new FavoriteRoute();
    f.setPassengerId(pid);
    f.setRouteId(routeId);
    favoriteRouteRepository.save(f);
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", f.getId());
    m.put("routeId", f.getRouteId());
    return m;
  }

  @Transactional
  public Map<String, Object> removeRoute(String userId, String routeId) {
    checkOwner(userId);
    String pid = passengerIdFor(userId);
    if (pid != null) favoriteRouteRepository.deleteByPassengerIdAndRouteId(pid, routeId);
    return Map.of("ok", true);
  }
}

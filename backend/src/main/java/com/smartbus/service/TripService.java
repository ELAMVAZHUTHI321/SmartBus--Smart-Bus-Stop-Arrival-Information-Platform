package com.smartbus.service;

import com.smartbus.entity.Bus;
import com.smartbus.entity.BusLocation;
import com.smartbus.entity.BusRoute;
import com.smartbus.entity.BusTrip;
import com.smartbus.entity.TripStatus;
import com.smartbus.exception.ApiException;
import com.smartbus.repository.BusLocationRepository;
import com.smartbus.repository.BusRepository;
import com.smartbus.repository.BusRouteRepository;
import com.smartbus.repository.BusTripRepository;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TripService {
  private final BusTripRepository tripRepository;
  private final BusLocationRepository locationRepository;
  private final BusRepository busRepository;
  private final BusRouteRepository routeRepository;
  private final AuditService auditService;

  public TripService(BusTripRepository tripRepository, BusLocationRepository locationRepository,
      BusRepository busRepository, BusRouteRepository routeRepository, AuditService auditService) {
    this.tripRepository = tripRepository;
    this.locationRepository = locationRepository;
    this.busRepository = busRepository;
    this.routeRepository = routeRepository;
    this.auditService = auditService;
  }

  public Map<String, Object> decorate(BusTrip t) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", t.getId());
    m.put("busId", t.getBusId());
    m.put("routeId", t.getRouteId());
    m.put("scheduleId", t.getScheduleId());
    m.put("tripDate", t.getTripDate());
    m.put("startTime", t.getStartTime() == null ? null : t.getStartTime().toString());
    m.put("endTime", t.getEndTime() == null ? null : t.getEndTime().toString());
    m.put("status", t.getStatus().name());
    m.put("busNumber", busRepository.findById(t.getBusId()).map(Bus::getBusNumber).orElse(null));
    m.put("routeName", routeRepository.findById(t.getRouteId()).map(BusRoute::getRouteName).orElse(null));
    return m;
  }

  private TripStatus parseStatus(Object v) {
    if (v == null) return TripStatus.SCHEDULED;
    try {
      return TripStatus.valueOf(String.valueOf(v).trim().toUpperCase());
    } catch (IllegalArgumentException e) {
      throw ApiException.badRequest("Invalid trip status.");
    }
  }

  private Instant parseInstant(Object v) {
    if (v == null || String.valueOf(v).isBlank()) return null;
    try {
      return Instant.parse(String.valueOf(v).trim());
    } catch (Exception e) {
      throw ApiException.badRequest("Invalid timestamp.");
    }
  }

  public List<Map<String, Object>> list() {
    return tripRepository.findAll().stream().map(this::decorate).collect(Collectors.toList());
  }

  public Map<String, Object> getById(String id) {
    BusTrip t = tripRepository.findById(id).orElseThrow(() -> ApiException.notFound("Trip not found."));
    return decorate(t);
  }

  @Transactional
  public Map<String, Object> create(Map<String, Object> data) {
    BusTrip t = new BusTrip();
    t.setBusId(data.get("busId") == null ? null : String.valueOf(data.get("busId")));
    t.setRouteId(data.get("routeId") == null ? null : String.valueOf(data.get("routeId")));
    Object sc = data.get("scheduleId");
    t.setScheduleId(sc == null ? null : String.valueOf(sc));
    Object td = data.get("tripDate");
    t.setTripDate(td == null ? null : String.valueOf(td));
    t.setStartTime(parseInstant(data.get("startTime")));
    t.setEndTime(parseInstant(data.get("endTime")));
    t.setStatus(parseStatus(data.get("status")));
    if (t.getBusId() == null || t.getRouteId() == null) {
      throw ApiException.badRequest("busId and routeId are required.");
    }
    tripRepository.save(t);
    auditService.log(AuthService.currentUserId(), "CREATE", "TRIP", t.getId());
    return decorate(t);
  }

  @Transactional
  public Map<String, Object> updateStatus(String id, Map<String, Object> body) {
    BusTrip t = tripRepository.findById(id).orElseThrow(() -> ApiException.notFound("Trip not found."));
    TripStatus status = parseStatus(body == null ? null : body.get("status"));
    t.setStatus(status);
    if (status == TripStatus.ONGOING && t.getStartTime() == null) t.setStartTime(Instant.now());
    if ((status == TripStatus.COMPLETED || status == TripStatus.CANCELLED) && t.getEndTime() == null) {
      t.setEndTime(Instant.now());
    }
    tripRepository.save(t);
    auditService.log(AuthService.currentUserId(), "UPDATE", "TRIP", t.getId());
    return decorate(t);
  }

  @Transactional
  public Map<String, Object> remove(String id) {
    BusTrip t = tripRepository.findById(id).orElseThrow(() -> ApiException.notFound("Trip not found."));
    tripRepository.delete(t);
    auditService.log(AuthService.currentUserId(), "DELETE", "TRIP", id);
    return Map.of("ok", true);
  }

  public List<Map<String, Object>> locationsForTrip(String tripId) {
    tripRepository.findById(tripId).orElseThrow(() -> ApiException.notFound("Trip not found."));
    return locationRepository.findByTripIdOrderByRecordedAtAsc(tripId).stream().map(l -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("id", l.getId());
      m.put("tripId", l.getTripId());
      m.put("latitude", l.getLatitude());
      m.put("longitude", l.getLongitude());
      m.put("recordedAt", l.getRecordedAt() == null ? null : l.getRecordedAt().toString());
      return m;
    }).collect(Collectors.toList());
  }

  @Transactional
  public Map<String, Object> recordLocation(String tripId, Map<String, Object> body) {
    tripRepository.findById(tripId).orElseThrow(() -> ApiException.notFound("Trip not found."));
    Double lat = BusService.toDouble(body == null ? null : body.get("latitude"));
    Double lng = BusService.toDouble(body == null ? null : body.get("longitude"));
    if (lat == null || lng == null) throw ApiException.badRequest("latitude and longitude are required.");
    BusLocation l = new BusLocation();
    l.setTripId(tripId);
    l.setLatitude(lat);
    l.setLongitude(lng);
    locationRepository.save(l);
    auditService.log(AuthService.currentUserId(), "RECORD_LOCATION", "TRIP", tripId);
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", l.getId());
    m.put("tripId", l.getTripId());
    m.put("latitude", l.getLatitude());
    m.put("longitude", l.getLongitude());
    m.put("recordedAt", l.getRecordedAt().toString());
    return m;
  }
}

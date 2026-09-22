package com.smartbus.service;

import com.smartbus.entity.ArrivalPrediction;
import com.smartbus.entity.Bus;
import com.smartbus.entity.BusRoute;
import com.smartbus.entity.BusStop;
import com.smartbus.entity.BusTrip;
import com.smartbus.exception.ApiException;
import com.smartbus.repository.ArrivalPredictionRepository;
import com.smartbus.repository.BusRepository;
import com.smartbus.repository.BusRouteRepository;
import com.smartbus.repository.BusStopRepository;
import com.smartbus.repository.BusTripRepository;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PredictionService {
  private final ArrivalPredictionRepository predictionRepository;
  private final BusTripRepository tripRepository;
  private final BusStopRepository stopRepository;
  private final BusRepository busRepository;
  private final BusRouteRepository routeRepository;
  private final AuditService auditService;

  public PredictionService(ArrivalPredictionRepository predictionRepository,
      BusTripRepository tripRepository, BusStopRepository stopRepository,
      BusRepository busRepository, BusRouteRepository routeRepository, AuditService auditService) {
    this.predictionRepository = predictionRepository;
    this.tripRepository = tripRepository;
    this.stopRepository = stopRepository;
    this.busRepository = busRepository;
    this.routeRepository = routeRepository;
    this.auditService = auditService;
  }

  public Map<String, Object> decorate(ArrivalPrediction p) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", p.getId());
    m.put("tripId", p.getTripId());
    m.put("stopId", p.getStopId());
    m.put("predictedArrival", p.getPredictedArrival() == null ? null : p.getPredictedArrival().toString());
    m.put("predictionTime", p.getPredictionTime() == null ? null : p.getPredictionTime().toString());
    m.put("confidenceScore", p.getConfidenceScore());
    BusTrip trip = tripRepository.findById(p.getTripId()).orElse(null);
    if (trip != null) {
      m.put("busId", trip.getBusId());
      m.put("routeId", trip.getRouteId());
      m.put("busNumber", busRepository.findById(trip.getBusId()).map(Bus::getBusNumber).orElse(null));
      m.put("routeName", routeRepository.findById(trip.getRouteId()).map(BusRoute::getRouteName).orElse(null));
    }
    BusStop stop = stopRepository.findById(p.getStopId()).orElse(null);
    m.put("stop", stop == null ? null : StopService.decorateStatic(stop));
    return m;
  }

  public List<Map<String, Object>> forTrip(String tripId) {
    return predictionRepository.findByTripId(tripId).stream()
        .map(this::decorate).collect(Collectors.toList());
  }

  public List<Map<String, Object>> upcomingAtStop(String stopId) {
    Instant cutoff = Instant.now().minusSeconds(60);
    return predictionRepository.findByStopIdAndPredictedArrivalAfterOrderByPredictedArrivalAsc(stopId, cutoff)
        .stream().map(this::decorate).collect(Collectors.toList());
  }

  @Transactional
  public Map<String, Object> generate(Map<String, Object> data) {
    String tripId = data.get("tripId") == null ? null : String.valueOf(data.get("tripId"));
    String stopId = data.get("stopId") == null ? null : String.valueOf(data.get("stopId"));
    Object pa = data.get("predictedArrival");
    if (tripId == null || stopId == null || pa == null) {
      throw ApiException.badRequest("tripId, stopId and predictedArrival are required.");
    }
    Instant predictedArrival;
    try {
      predictedArrival = Instant.parse(String.valueOf(pa).trim());
    } catch (Exception e) {
      throw ApiException.badRequest("Invalid predictedArrival timestamp.");
    }
    ArrivalPrediction p = new ArrivalPrediction();
    p.setTripId(tripId);
    p.setStopId(stopId);
    p.setPredictedArrival(predictedArrival);
    p.setConfidenceScore(BusService.toDouble(data.get("confidenceScore")));
    predictionRepository.save(p);
    auditService.log(AuthService.currentUserId(), "CREATE", "PREDICTION", p.getId());
    return decorate(p);
  }
}

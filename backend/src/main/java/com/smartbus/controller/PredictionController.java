package com.smartbus.controller;

import com.smartbus.service.PredictionService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PredictionController {
  private final PredictionService predictionService;

  public PredictionController(PredictionService predictionService) {
    this.predictionService = predictionService;
  }

  @GetMapping("/trips/{tripId}/predictions")
  public List<Map<String, Object>> forTrip(@PathVariable("tripId") String tripId) {
    return predictionService.forTrip(tripId);
  }

  @GetMapping("/stops/{stopId}/arrivals")
  public List<Map<String, Object>> upcomingAtStop(@PathVariable("stopId") String stopId) {
    return predictionService.upcomingAtStop(stopId);
  }

  @PostMapping("/predictions")
  public Map<String, Object> generate(@RequestBody Map<String, Object> data) {
    return predictionService.generate(data);
  }
}

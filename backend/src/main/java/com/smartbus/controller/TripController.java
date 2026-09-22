package com.smartbus.controller;

import com.smartbus.service.TripService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TripController {
  private final TripService tripService;

  public TripController(TripService tripService) {
    this.tripService = tripService;
  }

  @GetMapping("/trips")
  public List<Map<String, Object>> list() {
    return tripService.list();
  }

  @GetMapping("/trips/{id}")
  public Map<String, Object> getById(@PathVariable("id") String id) {
    return tripService.getById(id);
  }

  @PostMapping("/trips")
  public Map<String, Object> create(@RequestBody Map<String, Object> data) {
    return tripService.create(data);
  }

  @PatchMapping("/trips/{id}/status")
  public Map<String, Object> updateStatus(@PathVariable("id") String id, @RequestBody Map<String, Object> body) {
    return tripService.updateStatus(id, body);
  }

  @DeleteMapping("/trips/{id}")
  public Map<String, Object> remove(@PathVariable("id") String id) {
    return tripService.remove(id);
  }

  @GetMapping("/trips/{tripId}/locations")
  public List<Map<String, Object>> locations(@PathVariable("tripId") String tripId) {
    return tripService.locationsForTrip(tripId);
  }

  @PostMapping("/trips/{tripId}/locations")
  public Map<String, Object> recordLocation(@PathVariable("tripId") String tripId,
      @RequestBody Map<String, Object> body) {
    return tripService.recordLocation(tripId, body);
  }
}

package com.smartbus.controller;

import com.smartbus.service.BusService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class BusController {
  private final BusService busService;

  public BusController(BusService busService) {
    this.busService = busService;
  }

  @GetMapping("/buses")
  public List<Map<String, Object>> list() {
    return busService.list();
  }

  @GetMapping("/buses/{id}")
  public Map<String, Object> getById(@PathVariable("id") String id) {
    return busService.getById(id);
  }

  @PostMapping("/buses")
  public Map<String, Object> create(@RequestBody Map<String, Object> data) {
    return busService.create(data);
  }

  @PutMapping("/buses/{id}")
  public Map<String, Object> update(@PathVariable("id") String id, @RequestBody Map<String, Object> data) {
    return busService.update(id, data);
  }

  @DeleteMapping("/buses/{id}")
  public Map<String, Object> remove(@PathVariable("id") String id) {
    return busService.remove(id);
  }

  @GetMapping("/routes/{routeId}/buses")
  public List<Map<String, Object>> byRoute(@PathVariable("routeId") String routeId) {
    return busService.byRoute(routeId);
  }
}

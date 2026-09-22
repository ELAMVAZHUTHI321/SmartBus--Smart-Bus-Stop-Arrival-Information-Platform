package com.smartbus.controller;

import com.smartbus.service.RouteService;
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
public class RouteController {
  private final RouteService routeService;

  public RouteController(RouteService routeService) {
    this.routeService = routeService;
  }

  @GetMapping("/routes")
  public List<Map<String, Object>> list() {
    return routeService.list();
  }

  @GetMapping("/routes/{id}")
  public Map<String, Object> getById(@PathVariable("id") String id) {
    return routeService.getById(id);
  }

  @PostMapping("/routes")
  public Map<String, Object> create(@RequestBody Map<String, Object> data) {
    return routeService.create(data);
  }

  @PutMapping("/routes/{id}")
  public Map<String, Object> update(@PathVariable("id") String id, @RequestBody Map<String, Object> data) {
    return routeService.update(id, data);
  }

  @DeleteMapping("/routes/{id}")
  public Map<String, Object> remove(@PathVariable("id") String id) {
    return routeService.remove(id);
  }

  @GetMapping("/routes/{routeId}/stops")
  public List<Map<String, Object>> stopsForRoute(@PathVariable("routeId") String routeId) {
    return routeService.stopsForRoute(routeId);
  }
}

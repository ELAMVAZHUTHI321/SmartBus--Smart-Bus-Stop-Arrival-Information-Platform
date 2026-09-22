package com.smartbus.controller;

import com.smartbus.service.StopService;
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
public class StopController {
  private final StopService stopService;

  public StopController(StopService stopService) {
    this.stopService = stopService;
  }

  @GetMapping("/stops")
  public List<Map<String, Object>> list() {
    return stopService.list();
  }

  @GetMapping("/stops/{id}")
  public Map<String, Object> getById(@PathVariable("id") String id) {
    return stopService.getById(id);
  }

  @PostMapping("/stops")
  public Map<String, Object> create(@RequestBody Map<String, Object> data) {
    return stopService.create(data);
  }

  @PutMapping("/stops/{id}")
  public Map<String, Object> update(@PathVariable("id") String id, @RequestBody Map<String, Object> data) {
    return stopService.update(id, data);
  }

  @DeleteMapping("/stops/{id}")
  public Map<String, Object> remove(@PathVariable("id") String id) {
    return stopService.remove(id);
  }

  @GetMapping("/stops/{stopId}/routes")
  public List<Map<String, Object>> routesForStop(@PathVariable("stopId") String stopId) {
    return stopService.routesForStop(stopId);
  }
}

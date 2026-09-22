package com.smartbus.controller;

import com.smartbus.service.ScheduleService;
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
public class ScheduleController {
  private final ScheduleService scheduleService;

  public ScheduleController(ScheduleService scheduleService) {
    this.scheduleService = scheduleService;
  }

  @GetMapping("/schedules")
  public List<Map<String, Object>> list() {
    return scheduleService.list();
  }

  @PostMapping("/schedules")
  public Map<String, Object> create(@RequestBody Map<String, Object> data) {
    return scheduleService.create(data);
  }

  @PutMapping("/schedules/{id}")
  public Map<String, Object> update(@PathVariable("id") String id, @RequestBody Map<String, Object> data) {
    return scheduleService.update(id, data);
  }

  @DeleteMapping("/schedules/{id}")
  public Map<String, Object> remove(@PathVariable("id") String id) {
    return scheduleService.remove(id);
  }

  @GetMapping("/routes/{routeId}/schedules")
  public List<Map<String, Object>> forRoute(@PathVariable("routeId") String routeId) {
    return scheduleService.forRoute(routeId);
  }
}

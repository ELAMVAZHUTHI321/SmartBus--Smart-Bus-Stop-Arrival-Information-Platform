package com.smartbus.controller;

import com.smartbus.dto.SafeUser;
import com.smartbus.service.AdminService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final AdminService adminService;

  public AdminController(AdminService adminService) {
    this.adminService = adminService;
  }

  @GetMapping("/stats")
  public Map<String, Object> stats() {
    return adminService.stats();
  }

  @GetMapping("/users")
  public List<SafeUser> listUsers() {
    return adminService.listUsers();
  }

  @PutMapping("/users/{id}")
  public SafeUser updateUser(@PathVariable("id") String id, @RequestBody Map<String, Object> patch) {
    return adminService.updateUser(id, patch);
  }

  @GetMapping("/operators")
  public List<Map<String, Object>> listOperators() {
    return adminService.listOperators();
  }

  @PostMapping("/operators")
  public Map<String, Object> createOperator(@RequestBody Map<String, Object> data) {
    return adminService.createOperator(data);
  }

  @GetMapping("/audit-logs")
  public List<Map<String, Object>> auditLogs() {
    return adminService.auditLogs();
  }

  @GetMapping("/feedback")
  public List<Map<String, Object>> feedback() {
    return adminService.feedback();
  }

  @GetMapping("/delay-reports")
  public List<Map<String, Object>> delayReports() {
    return adminService.delayReports();
  }
}

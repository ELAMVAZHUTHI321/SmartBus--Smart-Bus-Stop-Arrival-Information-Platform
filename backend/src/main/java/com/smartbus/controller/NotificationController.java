package com.smartbus.controller;

import com.smartbus.service.NotificationService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class NotificationController {
  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping("/users/{userId}/notifications")
  public List<Map<String, Object>> listForUser(@PathVariable("userId") String userId) {
    return notificationService.listForUser(userId);
  }

  @GetMapping("/users/{userId}/notifications/unread")
  public long unreadCount(@PathVariable("userId") String userId) {
    return notificationService.unreadCount(userId);
  }

  @PatchMapping("/notifications/{notificationId}/read")
  public Map<String, Object> markRead(@PathVariable("notificationId") String notificationId) {
    return notificationService.markRead(notificationId);
  }

  @PatchMapping("/users/{userId}/notifications/read-all")
  public Map<String, Object> markAllRead(@PathVariable("userId") String userId) {
    return notificationService.markAllRead(userId);
  }

  @PostMapping("/notifications/broadcast")
  public List<Map<String, Object>> broadcast(@RequestBody Map<String, Object> body) {
    return notificationService.broadcast(body);
  }
}

package com.smartbus.service;

import com.smartbus.entity.NotifType;
import com.smartbus.entity.Notification;
import com.smartbus.entity.User;
import com.smartbus.exception.ApiException;
import com.smartbus.repository.NotificationRepository;
import com.smartbus.repository.UserRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {
  private final NotificationRepository notificationRepository;
  private final UserRepository userRepository;
  private final AuditService auditService;

  public NotificationService(NotificationRepository notificationRepository,
      UserRepository userRepository, AuditService auditService) {
    this.notificationRepository = notificationRepository;
    this.userRepository = userRepository;
    this.auditService = auditService;
  }

  public static Map<String, Object> decorateStatic(Notification n) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", n.getId());
    m.put("userId", n.getUserId());
    m.put("title", n.getTitle());
    m.put("message", n.getMessage());
    m.put("type", n.getType().name());
    m.put("isRead", n.isRead());
    m.put("createdAt", n.getCreatedAt() == null ? null : n.getCreatedAt().toString());
    return m;
  }

  private void checkOwner(String userId) {
    String me = AuthService.currentUserId();
    if (me == null || (!me.equals(userId) && !AuthService.currentHasRole("ADMIN"))) {
      throw ApiException.forbidden("You can only access your own notifications.");
    }
  }

  public List<Map<String, Object>> listForUser(String userId) {
    checkOwner(userId);
    return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
        .map(NotificationService::decorateStatic).collect(Collectors.toList());
  }

  public long unreadCount(String userId) {
    checkOwner(userId);
    return notificationRepository.countByUserIdAndReadFalse(userId);
  }

  @Transactional
  public Map<String, Object> markRead(String notificationId) {
    Notification n = notificationRepository.findById(notificationId)
        .orElseThrow(() -> ApiException.notFound("Notification not found."));
    checkOwner(n.getUserId());
    n.setRead(true);
    notificationRepository.save(n);
    return decorateStatic(n);
  }

  @Transactional
  public Map<String, Object> markAllRead(String userId) {
    checkOwner(userId);
    List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    for (Notification n : list) {
      if (!n.isRead()) {
        n.setRead(true);
        notificationRepository.save(n);
      }
    }
    return Map.of("ok", true);
  }

  @Transactional
  public List<Map<String, Object>> broadcast(Map<String, Object> body) {
    String title = body == null || body.get("title") == null ? null : String.valueOf(body.get("title"));
    String message = body == null || body.get("message") == null ? null : String.valueOf(body.get("message"));
    if (title == null || title.isBlank() || message == null || message.isBlank()) {
      throw ApiException.badRequest("title and message are required.");
    }
    NotifType type = NotifType.SYSTEM;
    if (body.get("type") != null) {
      try {
        type = NotifType.valueOf(String.valueOf(body.get("type")).trim().toUpperCase());
      } catch (IllegalArgumentException e) {
        throw ApiException.badRequest("Invalid notification type.");
      }
    }
    List<Map<String, Object>> created = new java.util.ArrayList<>();
    for (User u : userRepository.findAll()) {
      Notification n = new Notification();
      n.setUserId(u.getId());
      n.setTitle(title);
      n.setMessage(message);
      n.setType(type);
      notificationRepository.save(n);
      created.add(decorateStatic(n));
    }
    auditService.log(AuthService.currentUserId(), "CREATE", "NOTIFICATION", null);
    return created;
  }
}

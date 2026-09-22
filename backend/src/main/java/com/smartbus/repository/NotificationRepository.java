package com.smartbus.repository;

import com.smartbus.entity.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, String> {
  List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
  long countByUserIdAndReadFalse(String userId);
}

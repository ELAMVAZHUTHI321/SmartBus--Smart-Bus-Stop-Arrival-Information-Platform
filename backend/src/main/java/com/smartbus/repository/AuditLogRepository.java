package com.smartbus.repository;

import com.smartbus.entity.AuditLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
  List<AuditLog> findAllByOrderByCreatedAtDesc();
}

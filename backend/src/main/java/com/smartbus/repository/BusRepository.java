package com.smartbus.repository;

import com.smartbus.entity.Bus;
import com.smartbus.entity.BusStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepository extends JpaRepository<Bus, String> {
  boolean existsByBusNumber(String busNumber);
  Optional<Bus> findByBusNumber(String busNumber);
  List<Bus> findByOperatorId(String operatorId);
  long countByStatus(BusStatus status);
}

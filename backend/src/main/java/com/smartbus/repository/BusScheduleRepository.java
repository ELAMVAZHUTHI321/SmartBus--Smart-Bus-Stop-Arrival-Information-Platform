package com.smartbus.repository;

import com.smartbus.entity.BusSchedule;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusScheduleRepository extends JpaRepository<BusSchedule, String> {
  List<BusSchedule> findByRouteId(String routeId);
}

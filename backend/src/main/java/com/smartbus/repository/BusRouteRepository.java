package com.smartbus.repository;

import com.smartbus.entity.BusRoute;
import com.smartbus.entity.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRouteRepository extends JpaRepository<BusRoute, String> {
  boolean existsByRouteName(String routeName);
  long countByStatus(RouteStatus status);
}

package com.smartbus.repository;

import com.smartbus.entity.RouteStop;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteStopRepository extends JpaRepository<RouteStop, String> {
  List<RouteStop> findByRouteIdOrderByStopOrderAsc(String routeId);
  List<RouteStop> findByStopId(String stopId);
}

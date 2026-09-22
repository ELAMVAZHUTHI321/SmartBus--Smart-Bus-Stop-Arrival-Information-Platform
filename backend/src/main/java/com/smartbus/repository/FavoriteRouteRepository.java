package com.smartbus.repository;

import com.smartbus.entity.FavoriteRoute;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRouteRepository extends JpaRepository<FavoriteRoute, String> {
  List<FavoriteRoute> findByPassengerId(String passengerId);
  Optional<FavoriteRoute> findByPassengerIdAndRouteId(String passengerId, String routeId);
  void deleteByPassengerIdAndRouteId(String passengerId, String routeId);
}

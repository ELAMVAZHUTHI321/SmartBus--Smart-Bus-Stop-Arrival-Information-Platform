package com.smartbus.repository;

import com.smartbus.entity.FavoriteStop;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteStopRepository extends JpaRepository<FavoriteStop, String> {
  List<FavoriteStop> findByPassengerId(String passengerId);
  Optional<FavoriteStop> findByPassengerIdAndStopId(String passengerId, String stopId);
  void deleteByPassengerIdAndStopId(String passengerId, String stopId);
}

package com.smartbus.repository;

import com.smartbus.entity.ArrivalPrediction;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArrivalPredictionRepository extends JpaRepository<ArrivalPrediction, String> {
  List<ArrivalPrediction> findByTripId(String tripId);
  List<ArrivalPrediction> findByStopIdAndPredictedArrivalAfterOrderByPredictedArrivalAsc(String stopId, Instant after);
}

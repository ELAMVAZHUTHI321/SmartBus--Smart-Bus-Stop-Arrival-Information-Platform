package com.smartbus.repository;

import com.smartbus.entity.BusLocation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusLocationRepository extends JpaRepository<BusLocation, String> {
  List<BusLocation> findByTripIdOrderByRecordedAtAsc(String tripId);
}

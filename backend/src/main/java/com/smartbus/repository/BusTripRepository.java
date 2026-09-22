package com.smartbus.repository;

import com.smartbus.entity.BusTrip;
import com.smartbus.entity.TripStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusTripRepository extends JpaRepository<BusTrip, String> {
  List<BusTrip> findByTripDate(String tripDate);
  long countByTripDate(String tripDate);
  long countByStatus(TripStatus status);
}

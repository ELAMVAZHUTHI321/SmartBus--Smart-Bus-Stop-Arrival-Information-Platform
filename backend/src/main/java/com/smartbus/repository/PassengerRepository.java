package com.smartbus.repository;

import com.smartbus.entity.Passenger;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassengerRepository extends JpaRepository<Passenger, String> {
  Optional<Passenger> findByUserId(String userId);
}

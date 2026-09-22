package com.smartbus.repository;

import com.smartbus.entity.BusStop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusStopRepository extends JpaRepository<BusStop, String> {
}

package com.smartbus.repository;

import com.smartbus.entity.TransportOperator;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportOperatorRepository extends JpaRepository<TransportOperator, String> {
  Optional<TransportOperator> findByUserId(String userId);
}

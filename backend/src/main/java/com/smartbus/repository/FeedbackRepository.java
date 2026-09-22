package com.smartbus.repository;

import com.smartbus.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FeedbackRepository extends JpaRepository<Feedback, String> {
  @Query("SELECT COALESCE(AVG(f.rating), 0) FROM Feedback f")
  double averageRating();
}

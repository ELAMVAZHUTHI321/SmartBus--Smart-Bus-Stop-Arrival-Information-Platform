package com.smartbus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "feedback")
public class Feedback {
  @Id
  private String id;

  @Column(nullable = false, name = "trip_id")
  private String tripId;

  @Column(nullable = false, name = "passenger_id")
  private String passengerId;

  @Column(nullable = false)
  private int rating;

  @Column(columnDefinition = "TEXT")
  private String comments;

  @Column(nullable = false, name = "created_at")
  private Instant createdAt;

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID().toString();
    if (createdAt == null) createdAt = Instant.now();
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getTripId() { return tripId; }
  public void setTripId(String tripId) { this.tripId = tripId; }
  public String getPassengerId() { return passengerId; }
  public void setPassengerId(String passengerId) { this.passengerId = passengerId; }
  public int getRating() { return rating; }
  public void setRating(int rating) { this.rating = rating; }
  public String getComments() { return comments; }
  public void setComments(String comments) { this.comments = comments; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

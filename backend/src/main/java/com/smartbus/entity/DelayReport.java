package com.smartbus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "delay_reports")
public class DelayReport {
  @Id
  private String id;

  @Column(nullable = false, name = "trip_id")
  private String tripId;

  @Column(nullable = false, name = "passenger_id")
  private String passengerId;

  @Column(columnDefinition = "TEXT")
  private String reason;

  @Column(name = "delay_minutes")
  private Integer delayMinutes;

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
  public String getReason() { return reason; }
  public void setReason(String reason) { this.reason = reason; }
  public Integer getDelayMinutes() { return delayMinutes; }
  public void setDelayMinutes(Integer delayMinutes) { this.delayMinutes = delayMinutes; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

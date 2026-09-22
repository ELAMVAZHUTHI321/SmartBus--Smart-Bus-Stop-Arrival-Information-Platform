package com.smartbus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "buses")
public class Bus {
  @Id
  private String id;

  @Column(nullable = false, name = "operator_id")
  private String operatorId;

  @Column(nullable = false, name = "bus_number", unique = true)
  private String busNumber;

  @Column(name = "bus_type")
  private String busType;

  private Integer capacity;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private BusStatus status = BusStatus.ACTIVE;

  @Column(nullable = false, name = "created_at")
  private Instant createdAt;

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID().toString();
    if (createdAt == null) createdAt = Instant.now();
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getOperatorId() { return operatorId; }
  public void setOperatorId(String operatorId) { this.operatorId = operatorId; }
  public String getBusNumber() { return busNumber; }
  public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
  public String getBusType() { return busType; }
  public void setBusType(String busType) { this.busType = busType; }
  public Integer getCapacity() { return capacity; }
  public void setCapacity(Integer capacity) { this.capacity = capacity; }
  public BusStatus getStatus() { return status; }
  public void setStatus(BusStatus status) { this.status = status; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

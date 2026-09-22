package com.smartbus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "favorite_routes", uniqueConstraints = @UniqueConstraint(columnNames = {"passenger_id", "route_id"}))
public class FavoriteRoute {
  @Id
  private String id;

  @Column(nullable = false, name = "passenger_id")
  private String passengerId;

  @Column(nullable = false, name = "route_id")
  private String routeId;

  @Column(nullable = false, name = "created_at")
  private Instant createdAt;

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID().toString();
    if (createdAt == null) createdAt = Instant.now();
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getPassengerId() { return passengerId; }
  public void setPassengerId(String passengerId) { this.passengerId = passengerId; }
  public String getRouteId() { return routeId; }
  public void setRouteId(String routeId) { this.routeId = routeId; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

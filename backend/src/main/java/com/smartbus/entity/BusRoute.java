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
@Table(name = "bus_routes")
public class BusRoute {
  @Id
  private String id;

  @Column(nullable = false, name = "route_name", unique = true)
  private String routeName;

  private String source;

  private String destination;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private RouteStatus status = RouteStatus.ACTIVE;

  @Column(nullable = false, name = "created_at")
  private Instant createdAt;

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID().toString();
    if (createdAt == null) createdAt = Instant.now();
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getRouteName() { return routeName; }
  public void setRouteName(String routeName) { this.routeName = routeName; }
  public String getSource() { return source; }
  public void setSource(String source) { this.source = source; }
  public String getDestination() { return destination; }
  public void setDestination(String destination) { this.destination = destination; }
  public RouteStatus getStatus() { return status; }
  public void setStatus(RouteStatus status) { this.status = status; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

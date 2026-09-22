package com.smartbus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;

@Entity
@Table(name = "route_stops", uniqueConstraints = @UniqueConstraint(columnNames = {"route_id", "stop_id"}))
public class RouteStop {
  @Id
  private String id;

  @Column(nullable = false, name = "route_id")
  private String routeId;

  @Column(nullable = false, name = "stop_id")
  private String stopId;

  @Column(nullable = false, name = "stop_order")
  private int stopOrder;

  @Column(name = "distance_km")
  private Double distanceKm;

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID().toString();
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getRouteId() { return routeId; }
  public void setRouteId(String routeId) { this.routeId = routeId; }
  public String getStopId() { return stopId; }
  public void setStopId(String stopId) { this.stopId = stopId; }
  public int getStopOrder() { return stopOrder; }
  public void setStopOrder(int stopOrder) { this.stopOrder = stopOrder; }
  public Double getDistanceKm() { return distanceKm; }
  public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
}

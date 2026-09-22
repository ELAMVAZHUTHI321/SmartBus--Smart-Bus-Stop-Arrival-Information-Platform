package com.smartbus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "bus_schedules")
public class BusSchedule {
  @Id
  private String id;

  @Column(nullable = false, name = "route_id")
  private String routeId;

  @Column(nullable = false, name = "bus_id")
  private String busId;

  @Column(name = "departure_time")
  private String departureTime;

  @Column(name = "arrival_time")
  private String arrivalTime;

  private String days;

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID().toString();
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getRouteId() { return routeId; }
  public void setRouteId(String routeId) { this.routeId = routeId; }
  public String getBusId() { return busId; }
  public void setBusId(String busId) { this.busId = busId; }
  public String getDepartureTime() { return departureTime; }
  public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
  public String getArrivalTime() { return arrivalTime; }
  public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
  public String getDays() { return days; }
  public void setDays(String days) { this.days = days; }
}

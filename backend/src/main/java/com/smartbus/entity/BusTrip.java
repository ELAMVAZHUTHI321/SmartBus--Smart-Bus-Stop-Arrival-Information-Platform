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
@Table(name = "bus_trips")
public class BusTrip {
  @Id
  private String id;

  @Column(nullable = false, name = "bus_id")
  private String busId;

  @Column(nullable = false, name = "route_id")
  private String routeId;

  @Column(name = "schedule_id")
  private String scheduleId;

  @Column(name = "trip_date")
  private String tripDate;

  @Column(name = "start_time")
  private Instant startTime;

  @Column(name = "end_time")
  private Instant endTime;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TripStatus status = TripStatus.SCHEDULED;

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID().toString();
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getBusId() { return busId; }
  public void setBusId(String busId) { this.busId = busId; }
  public String getRouteId() { return routeId; }
  public void setRouteId(String routeId) { this.routeId = routeId; }
  public String getScheduleId() { return scheduleId; }
  public void setScheduleId(String scheduleId) { this.scheduleId = scheduleId; }
  public String getTripDate() { return tripDate; }
  public void setTripDate(String tripDate) { this.tripDate = tripDate; }
  public Instant getStartTime() { return startTime; }
  public void setStartTime(Instant startTime) { this.startTime = startTime; }
  public Instant getEndTime() { return endTime; }
  public void setEndTime(Instant endTime) { this.endTime = endTime; }
  public TripStatus getStatus() { return status; }
  public void setStatus(TripStatus status) { this.status = status; }
}

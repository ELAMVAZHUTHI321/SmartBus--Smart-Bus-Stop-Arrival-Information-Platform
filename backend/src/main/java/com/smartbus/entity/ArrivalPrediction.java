package com.smartbus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "arrival_predictions")
public class ArrivalPrediction {
  @Id
  private String id;

  @Column(nullable = false, name = "trip_id")
  private String tripId;

  @Column(nullable = false, name = "stop_id")
  private String stopId;

  @Column(nullable = false, name = "predicted_arrival")
  private Instant predictedArrival;

  @Column(nullable = false, name = "prediction_time")
  private Instant predictionTime;

  @Column(name = "confidence_score")
  private Double confidenceScore;

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID().toString();
    if (predictionTime == null) predictionTime = Instant.now();
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getTripId() { return tripId; }
  public void setTripId(String tripId) { this.tripId = tripId; }
  public String getStopId() { return stopId; }
  public void setStopId(String stopId) { this.stopId = stopId; }
  public Instant getPredictedArrival() { return predictedArrival; }
  public void setPredictedArrival(Instant predictedArrival) { this.predictedArrival = predictedArrival; }
  public Instant getPredictionTime() { return predictionTime; }
  public void setPredictionTime(Instant predictionTime) { this.predictionTime = predictionTime; }
  public Double getConfidenceScore() { return confidenceScore; }
  public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
}

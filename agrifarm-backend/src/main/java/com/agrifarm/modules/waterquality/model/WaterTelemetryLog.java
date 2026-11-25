package com.agrifarm.modules.waterquality.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "water_telemetry_logs")
public class WaterTelemetryLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "pond_id", nullable = false)
    private UUID pondId;

    @Column(name = "dissolved_oxygen", nullable = false)
    private Double dissolvedOxygen;

    @Column(nullable = false)
    private Double ph;

    @Column(name = "temperature_celsius", nullable = false)
    private Double temperatureCelsius;

    @Column(name = "ammonia_tan")
    private Double ammoniaTan;

    private Double nitrite;

    @Column(name = "transparency_cm")
    private Double transparencyCm;

    @Column(name = "alert_level", nullable = false)
    @Builder.Default
    private String alertLevel = "OPTIMAL";

    @Column(name = "logged_at", nullable = false)
    @Builder.Default
    private Instant loggedAt = Instant.now();
}

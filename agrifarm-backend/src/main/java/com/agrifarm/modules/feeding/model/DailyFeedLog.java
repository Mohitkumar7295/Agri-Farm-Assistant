package com.agrifarm.modules.feeding.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "daily_feed_logs")
public class DailyFeedLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "feed_type", nullable = false)
    private String feedType;

    @Column(name = "quantity_kg", nullable = false)
    private Double quantityKg;

    @Column(name = "feeding_session", nullable = false)
    @Builder.Default
    private String feedingSession = "MORNING";

    @Column(name = "cost_per_kg")
    private Double costPerKg;

    @Column(name = "logged_at", nullable = false)
    @Builder.Default
    private Instant loggedAt = Instant.now();
}

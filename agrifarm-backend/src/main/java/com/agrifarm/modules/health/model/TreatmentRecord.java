package com.agrifarm.modules.health.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "treatment_records")
public class TreatmentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "medication_name", nullable = false)
    private String medicationName;

    @Column(nullable = false)
    private String dosage;

    @Column(name = "withdrawal_days", nullable = false)
    @Builder.Default
    private Integer withdrawalDays = 0;

    @Column(name = "safe_harvest_date")
    private LocalDate safeHarvestDate;

    @Column(name = "administered_at", nullable = false)
    @Builder.Default
    private Instant administeredAt = Instant.now();
}

package com.agrifarm.modules.growth.model;

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
@Table(name = "sampling_logs")
public class SamplingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "batch_id", nullable = false)
    private UUID batchId;

    private String specie;

    @Column(name = "sample_size_count", nullable = false)
    private Integer sampleSizeCount;

    @Column(name = "average_weight_grams", nullable = false)
    private Double averageWeightGrams;

    @Column(name = "sampling_date", nullable = false)
    private LocalDate samplingDate;

    @Column(name = "dwg_grams_per_day")
    private Double dwgGramsPerDay;

    @Column(name = "sgr_percentage")
    private Double sgrPercentage;

    @Column(name = "estimated_biomass_kg")
    private Double estimatedBiomassKg;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}

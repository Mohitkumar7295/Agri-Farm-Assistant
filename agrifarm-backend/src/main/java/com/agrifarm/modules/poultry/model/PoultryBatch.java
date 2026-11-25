package com.agrifarm.modules.poultry.model;

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
@Table(name = "poultry_batches")
public class PoultryBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "shed_id", nullable = false)
    private UUID shedId;

    @Column(name = "batch_code", nullable = false)
    private String batchCode;

    @Column(nullable = false)
    private String breed;

    @Column(nullable = false)
    @Builder.Default
    private String category = "BROILER";

    @Column(name = "initial_quantity", nullable = false)
    private Integer initialQuantity;

    @Column(name = "current_quantity", nullable = false)
    private Integer currentQuantity;

    @Column(name = "hatch_date", nullable = false)
    private LocalDate hatchDate;

    @Column(name = "initial_avg_weight_grams", nullable = false)
    private Double initialAvgWeightGrams;

    @Column(name = "current_avg_weight_grams", nullable = false)
    private Double currentAvgWeightGrams;

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}

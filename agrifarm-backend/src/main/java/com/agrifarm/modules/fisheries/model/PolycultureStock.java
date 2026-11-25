package com.agrifarm.modules.fisheries.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "polyculture_stocks")
public class PolycultureStock {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "fish_batch_id", nullable = false)
    private UUID fishBatchId;

    @Column(nullable = false)
    private String specie;

    @Column(name = "initial_quantity", nullable = false)
    private Integer initialQuantity;

    @Column(name = "current_quantity", nullable = false)
    private Integer currentQuantity;

    @Column(name = "initial_avg_weight_grams", nullable = false)
    private Double initialAvgWeightGrams;

    @Column(name = "current_avg_weight_grams", nullable = false)
    private Double currentAvgWeightGrams;
}

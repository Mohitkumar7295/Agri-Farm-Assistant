package com.agrifarm.modules.fisheries.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ponds")
public class Pond {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "farm_id", nullable = false)
    private UUID farmId;

    @Column(nullable = false)
    private String name;

    @Column(name = "water_area_acres", nullable = false)
    private Double waterAreaAcres;

    @Column(name = "depth_feet", nullable = false)
    private Double depthFeet;

    @Column(name = "has_aerator", nullable = false)
    @Builder.Default
    private Boolean hasAerator = false;

    @Column(name = "aerator_hp")
    @Builder.Default
    private Double aeratorHp = 0.0;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}

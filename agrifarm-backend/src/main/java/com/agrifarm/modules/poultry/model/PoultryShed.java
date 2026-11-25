package com.agrifarm.modules.poultry.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "poultry_sheds")
public class PoultryShed {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "farm_id", nullable = false)
    private UUID farmId;

    @Column(name = "shed_name", nullable = false)
    private String shedName;

    @Column(name = "shed_type", nullable = false)
    @Builder.Default
    private String shedType = "OPEN_SIDED";

    @Column(name = "length_feet", nullable = false)
    private Double lengthFeet;

    @Column(name = "width_feet", nullable = false)
    private Double widthFeet;

    @Column(name = "capacity_birds", nullable = false)
    private Integer capacityBirds;

    @Column(name = "has_foggers", nullable = false)
    @Builder.Default
    private Boolean hasFoggers = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}

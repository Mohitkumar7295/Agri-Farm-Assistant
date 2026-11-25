package com.agrifarm.modules.fisheries.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fish_batches")
public class FishBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "pond_id", nullable = false)
    private UUID pondId;

    @Column(name = "batch_code", nullable = false)
    private String batchCode;

    @Column(name = "stocking_date", nullable = false)
    private LocalDate stockingDate;

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "fishBatchId", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private List<PolycultureStock> stocks = new ArrayList<>();
}

package com.agrifarm.modules.poultry.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vaccine_schedules")
public class VaccineSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "poultry_batch_id", nullable = false)
    private UUID poultryBatchId;

    @Column(name = "vaccine_name", nullable = false)
    private String vaccineName;

    @Column(name = "disease_prevented", nullable = false)
    private String diseasePrevented;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(nullable = false)
    @Builder.Default
    private Boolean administered = false;

    @Column(name = "administered_date")
    private LocalDate administeredDate;

    @Column(name = "withdrawal_days", nullable = false)
    @Builder.Default
    private Integer withdrawalDays = 0;
}

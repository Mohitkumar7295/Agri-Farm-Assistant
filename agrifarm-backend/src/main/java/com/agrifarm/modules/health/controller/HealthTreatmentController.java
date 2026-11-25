package com.agrifarm.modules.health.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.health.model.ClinicalLog;
import com.agrifarm.modules.health.model.TreatmentRecord;
import com.agrifarm.modules.health.service.HealthTreatmentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
public class HealthTreatmentController {

    private final HealthTreatmentService healthService;

    @PostMapping("/observations")
    public ResponseEntity<ApiResponse<ClinicalLog>> logObservation(@Valid @RequestBody ClinicalObservationDto dto) {
        ClinicalLog saved = healthService.logObservation(
                dto.getEntityType(), dto.getEntityId(), dto.getSymptoms(), dto.getDiagnosis(), dto.getSeverity()
        );
        return ResponseEntity.ok(ApiResponse.success("Clinical observation recorded", saved));
    }

    @GetMapping("/observations/{entityId}")
    public ResponseEntity<ApiResponse<List<ClinicalLog>>> listObservations(@PathVariable UUID entityId) {
        return ResponseEntity.ok(ApiResponse.success("Clinical observations retrieved", healthService.listObservations(entityId)));
    }

    @PostMapping("/treatments")
    public ResponseEntity<ApiResponse<TreatmentRecord>> recordTreatment(@Valid @RequestBody TreatmentDto dto) {
        TreatmentRecord saved = healthService.recordTreatment(
                dto.getEntityType(), dto.getEntityId(), dto.getMedicationName(), dto.getDosage(), dto.getWithdrawalDays()
        );
        return ResponseEntity.ok(ApiResponse.success("Treatment recorded with withdrawal period", saved));
    }

    @GetMapping("/treatments/{entityId}")
    public ResponseEntity<ApiResponse<List<TreatmentRecord>>> listTreatments(@PathVariable UUID entityId) {
        return ResponseEntity.ok(ApiResponse.success("Treatments retrieved", healthService.listTreatments(entityId)));
    }

    @Data
    public static class ClinicalObservationDto {
        @NotBlank
        private String entityType;
        @NotNull
        private UUID entityId;
        @NotBlank
        private String symptoms;
        private String diagnosis;
        private String severity = "INFO";
    }

    @Data
    public static class TreatmentDto {
        @NotBlank
        private String entityType;
        @NotNull
        private UUID entityId;
        @NotBlank
        private String medicationName;
        @NotBlank
        private String dosage;
        private Integer withdrawalDays = 0;
    }
}

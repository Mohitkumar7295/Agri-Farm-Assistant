package com.agrifarm.modules.health.service;

import com.agrifarm.modules.farm.service.FarmService;
import com.agrifarm.modules.health.model.ClinicalLog;
import com.agrifarm.modules.health.model.TreatmentRecord;
import com.agrifarm.modules.health.repository.ClinicalLogRepository;
import com.agrifarm.modules.health.repository.TreatmentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HealthTreatmentService {

    private final ClinicalLogRepository clinicalRepository;
    private final TreatmentRecordRepository treatmentRepository;
    private final FarmService farmService;

    @Transactional
    public ClinicalLog logObservation(String entityType, UUID entityId, String symptoms, String diagnosis, String severity) {
        UUID userId = farmService.requireCurrentUserId();
        ClinicalLog log = ClinicalLog.builder()
                .userId(userId)
                .entityType(entityType.trim().toUpperCase())
                .entityId(entityId)
                .symptoms(symptoms.trim())
                .diagnosis(diagnosis)
                .severity(severity != null ? severity.trim().toUpperCase() : "INFO")
                .build();
        return clinicalRepository.save(log);
    }

    @Transactional
    public TreatmentRecord recordTreatment(String entityType, UUID entityId, String medicationName, String dosage, Integer withdrawalDays) {
        UUID userId = farmService.requireCurrentUserId();
        int days = withdrawalDays != null ? Math.max(0, withdrawalDays) : 0;
        TreatmentRecord record = TreatmentRecord.builder()
                .userId(userId)
                .entityType(entityType.trim().toUpperCase())
                .entityId(entityId)
                .medicationName(medicationName.trim())
                .dosage(dosage.trim())
                .withdrawalDays(days)
                .safeHarvestDate(LocalDate.now().plusDays(days))
                .build();
        return treatmentRepository.save(record);
    }

    public List<ClinicalLog> listObservations(UUID entityId) {
        farmService.requireCurrentUserId();
        return clinicalRepository.findAllByEntityIdOrderByObservedAtDesc(entityId);
    }

    public List<TreatmentRecord> listTreatments(UUID entityId) {
        farmService.requireCurrentUserId();
        return treatmentRepository.findAllByEntityIdOrderByAdministeredAtDesc(entityId);
    }
}

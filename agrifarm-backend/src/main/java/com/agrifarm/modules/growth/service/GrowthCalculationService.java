package com.agrifarm.modules.growth.service;

import com.agrifarm.modules.farm.service.FarmService;
import com.agrifarm.modules.growth.model.SamplingLog;
import com.agrifarm.modules.growth.repository.SamplingLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GrowthCalculationService {

    private final SamplingLogRepository samplingRepository;
    private final FarmService farmService;

    @Transactional
    public SamplingLog recordSampling(
            String entityType,
            UUID batchId,
            String specie,
            int sampleSizeCount,
            double averageWeightGrams,
            LocalDate samplingDate,
            double initialWeightGrams,
            LocalDate startDate,
            int currentStockCount
    ) {
        UUID userId = farmService.requireCurrentUserId();
        LocalDate effectiveSampleDate = samplingDate != null ? samplingDate : LocalDate.now();
        long days = startDate != null ? Math.max(1, ChronoUnit.DAYS.between(startDate, effectiveSampleDate)) : 30;

        double dwg = (averageWeightGrams - initialWeightGrams) / days;
        double sgr = (initialWeightGrams > 0 && averageWeightGrams > 0)
                ? ((Math.log(averageWeightGrams) - Math.log(initialWeightGrams)) / days) * 100.0
                : 0.0;
        double biomassKg = (currentStockCount * averageWeightGrams) / 1000.0;

        SamplingLog log = SamplingLog.builder()
                .userId(userId)
                .entityType(entityType.trim().toUpperCase())
                .batchId(batchId)
                .specie(specie)
                .sampleSizeCount(sampleSizeCount)
                .averageWeightGrams(averageWeightGrams)
                .samplingDate(effectiveSampleDate)
                .dwgGramsPerDay(Math.round(dwg * 100.0) / 100.0)
                .sgrPercentage(Math.round(sgr * 100.0) / 100.0)
                .estimatedBiomassKg(Math.round(biomassKg * 100.0) / 100.0)
                .build();
        return samplingRepository.save(log);
    }

    public List<SamplingLog> listSamplings(UUID batchId) {
        farmService.requireCurrentUserId();
        return samplingRepository.findAllByBatchIdOrderBySamplingDateDesc(batchId);
    }
}

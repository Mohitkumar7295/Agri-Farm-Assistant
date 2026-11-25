package com.agrifarm.modules.feeding.service;

import com.agrifarm.modules.farm.service.FarmService;
import com.agrifarm.modules.feeding.model.DailyFeedLog;
import com.agrifarm.modules.feeding.repository.DailyFeedLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeedingEngineService {

    private final DailyFeedLogRepository feedLogRepository;
    private final FarmService farmService;

    @Transactional
    public DailyFeedLog logFeed(String entityType, UUID entityId, String feedType, double quantityKg, String session, Double costPerKg) {
        UUID userId = farmService.requireCurrentUserId();
        DailyFeedLog log = DailyFeedLog.builder()
                .userId(userId)
                .entityType(entityType.trim().toUpperCase())
                .entityId(entityId)
                .feedType(feedType.trim())
                .quantityKg(quantityKg)
                .feedingSession(session != null ? session.trim().toUpperCase() : "MORNING")
                .costPerKg(costPerKg)
                .build();
        return feedLogRepository.save(log);
    }

    public List<DailyFeedLog> listLogs(UUID entityId) {
        farmService.requireCurrentUserId();
        return feedLogRepository.findAllByEntityIdOrderByLoggedAtDesc(entityId);
    }

    /**
     * 10-day forward feed demand forecast applying ICAR K_temp and K_DO coefficients.
     */
    public List<Map<String, Object>> forecast10Days(double biomassKg, double feedingRatePct, double tempC, double doMgL) {
        farmService.requireCurrentUserId();
        double kTemp = tempC < 20.0 ? 0.60 : (tempC > 34.0 ? 0.70 : 1.00);
        double kDo = doMgL < 3.0 ? 0.00 : (doMgL < 5.0 ? 0.50 : 1.00);

        List<Map<String, Object>> days = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 1; i <= 10; i++) {
            double projectedBiomass = biomassKg * Math.pow(1.012, i - 1);
            double dailyKg = Math.round(projectedBiomass * (feedingRatePct / 100.0) * kTemp * kDo * 100.0) / 100.0;
            days.add(Map.of(
                    "date", today.plusDays(i).toString(),
                    "projectedBiomassKg", Math.round(projectedBiomass * 10.0) / 10.0,
                    "recommendedFeedKg", dailyKg,
                    "kTemp", kTemp,
                    "kDo", kDo
            ));
        }
        return days;
    }
}

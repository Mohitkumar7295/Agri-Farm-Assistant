package com.agrifarm.modules.waterquality.service;

import com.agrifarm.modules.farm.service.FarmService;
import com.agrifarm.modules.fisheries.service.FisheriesService;
import com.agrifarm.modules.waterquality.model.WaterTelemetryLog;
import com.agrifarm.modules.waterquality.repository.WaterTelemetryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WaterQualityService {

    private final WaterTelemetryRepository telemetryRepository;
    private final FarmService farmService;
    private final FisheriesService fisheriesService;

    @Transactional
    public WaterTelemetryLog logTelemetry(
            UUID pondId,
            double dissolvedOxygen,
            double ph,
            double temperatureCelsius,
            Double ammoniaTan,
            Double nitrite,
            Double transparencyCm,
            Instant loggedAt
    ) {
        UUID userId = farmService.requireCurrentUserId();
        fisheriesService.requireOwnedPond(pondId);

        String alertLevel = "OPTIMAL";
        if (dissolvedOxygen < 3.0 || (ammoniaTan != null && ammoniaTan > 0.05) || (nitrite != null && nitrite > 0.20)) {
            alertLevel = "CRITICAL";
        } else if (dissolvedOxygen < 5.0 || ph < 6.8 || ph > 8.2 || temperatureCelsius < 24.0 || temperatureCelsius > 33.0) {
            alertLevel = "WARNING";
        }

        WaterTelemetryLog log = WaterTelemetryLog.builder()
                .userId(userId)
                .pondId(pondId)
                .dissolvedOxygen(dissolvedOxygen)
                .ph(ph)
                .temperatureCelsius(temperatureCelsius)
                .ammoniaTan(ammoniaTan)
                .nitrite(nitrite)
                .transparencyCm(transparencyCm)
                .alertLevel(alertLevel)
                .loggedAt(loggedAt != null ? loggedAt : Instant.now())
                .build();
        return telemetryRepository.save(log);
    }

    public List<WaterTelemetryLog> listTelemetry(UUID pondId) {
        fisheriesService.requireOwnedPond(pondId);
        return telemetryRepository.findAllByPondIdOrderByLoggedAtDesc(pondId);
    }
}

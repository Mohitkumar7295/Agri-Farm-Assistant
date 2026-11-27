package com.agrifarm.modules.weather.service;

import com.agrifarm.modules.fisheries.model.Pond;
import com.agrifarm.modules.fisheries.repository.PondRepository;
import com.agrifarm.modules.weather.dto.WeatherResponse;
import com.agrifarm.modules.waterquality.model.WaterTelemetryLog;
import com.agrifarm.modules.waterquality.repository.WaterTelemetryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Predicts nocturnal dissolved oxygen depletion risk (0.0 - 1.0) using weather cloud cover,
 * ambient temperature, humidity, and latest pond DO telemetry per ICAR-CIFA thresholds.
 */
@Service
@RequiredArgsConstructor
public class NocturnalHypoxiaPredictor {

    private final PondRepository pondRepository;
    private final WaterTelemetryRepository waterTelemetryRepository;

    public record HypoxiaPrediction(double riskIndex, String riskLevel, Double latestDissolvedOxygen) {}

    public HypoxiaPrediction predictForFarm(UUID farmId, WeatherResponse weather) {
        Double lowestDo = null;
        List<Pond> ponds = pondRepository.findAllByFarmId(farmId);
        for (Pond pond : ponds) {
            List<WaterTelemetryLog> logs = waterTelemetryRepository.findAllByPondIdOrderByLoggedAtDesc(pond.getId());
            if (!logs.isEmpty()) {
                double doVal = logs.get(0).getDissolvedOxygen();
                if (lowestDo == null || doVal < lowestDo) {
                    lowestDo = doVal;
                }
            }
        }
        return computeRisk(
                weather.getTemperature(),
                weather.getHumidity(),
                weather.getCloudCover(),
                weather.getWindSpeed(),
                lowestDo
        );
    }

    public HypoxiaPrediction computeRisk(
            Double temperatureC,
            Integer humidityPercent,
            Integer cloudCoverPercent,
            Double windSpeedKmh,
            Double latestDoMgL
    ) {
        double score = 0.10;

        int cloud = cloudCoverPercent != null ? cloudCoverPercent : 0;
        if (cloud >= 80) score += 0.32;
        else if (cloud >= 50) score += 0.20;
        else if (cloud >= 25) score += 0.10;

        double temp = temperatureC != null ? temperatureC : 28.0;
        if (temp >= 34.0) score += 0.24;
        else if (temp >= 30.0) score += 0.15;
        else if (temp >= 26.0) score += 0.08;

        int humidity = humidityPercent != null ? humidityPercent : 65;
        if (humidity >= 80) score += 0.12;
        else if (humidity >= 70) score += 0.06;

        if (windSpeedKmh != null && windSpeedKmh < 5.0) {
            score += 0.08; // Low surface wind mixing
        }

        if (latestDoMgL != null) {
            if (latestDoMgL < 3.0) score += 0.35;
            else if (latestDoMgL < 5.0) score += 0.20;
        }

        double clamped = Math.round(Math.min(1.0, Math.max(0.0, score)) * 100.0) / 100.0;
        String level;
        if (clamped >= 0.75) {
            level = "CRITICAL";
        } else if (clamped >= 0.55) {
            level = "HIGH";
        } else if (clamped >= 0.35) {
            level = "MODERATE";
        } else {
            level = "LOW";
        }
        return new HypoxiaPrediction(clamped, level, latestDoMgL);
    }
}

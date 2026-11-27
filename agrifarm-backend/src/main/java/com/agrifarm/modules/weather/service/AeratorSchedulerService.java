package com.agrifarm.modules.weather.service;

import com.agrifarm.modules.weather.dto.WeatherSentinelRiskResponse.MandatoryAeratorSchedule;
import com.agrifarm.modules.weather.service.NocturnalHypoxiaPredictor.HypoxiaPrediction;
import org.springframework.stereotype.Service;

/**
 * Generates deterministic nocturnal aerator run schedules based on hypoxia risk index and latest DO.
 */
@Service
public class AeratorSchedulerService {

    public MandatoryAeratorSchedule buildSchedule(HypoxiaPrediction prediction) {
        String level = prediction.riskLevel();
        Double latestDo = prediction.latestDissolvedOxygen();

        if ("CRITICAL".equals(level)) {
            boolean emergencyLowDo = latestDo != null && latestDo < 3.0;
            return MandatoryAeratorSchedule.builder()
                    .aeratorRunRequired(true)
                    .startTime(emergencyLowDo ? "12:00 AM" : "02:00 AM")
                    .endTime("06:00 AM")
                    .recommendedHours(emergencyLowDo ? 6 : 4)
                    .reason(emergencyLowDo
                            ? "Critical dissolved oxygen (< 3.0 mg/L) detected; run mechanical aerators immediately and suspend morning feed."
                            : "Heavy cloud cover and high thermal load will cause dangerous pre-dawn DO depletion.")
                    .build();
        }
        if ("HIGH".equals(level)) {
            return MandatoryAeratorSchedule.builder()
                    .aeratorRunRequired(true)
                    .startTime("03:00 AM")
                    .endTime("06:00 AM")
                    .recommendedHours(3)
                    .reason("Elevated nocturnal respiration and cloud cover; run aerators during pre-dawn hours.")
                    .build();
        }
        if ("MODERATE".equals(level)) {
            return MandatoryAeratorSchedule.builder()
                    .aeratorRunRequired(true)
                    .startTime("04:00 AM")
                    .endTime("06:00 AM")
                    .recommendedHours(2)
                    .reason("Preventive 2-hour pre-dawn aeration recommended to maintain DO >= 5.0 mg/L.")
                    .build();
        }
        return MandatoryAeratorSchedule.builder()
                .aeratorRunRequired(false)
                .startTime("Standby")
                .endTime("Standby")
                .recommendedHours(0)
                .reason("Nocturnal hypoxia risk is low; monitor morning DO normally.")
                .build();
    }
}

package com.agrifarm.modules.weather.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherSentinelRiskResponse {

    private Double currentTemperature;
    private Integer currentHumidity;
    private Integer nighttimeCloudCoverPercent;
    private Double nocturnalHypoxiaRiskIndex;
    private String hypoxiaRiskLevel;
    private MandatoryAeratorSchedule mandatoryAeratorSchedule;
    private PoultryThermalAssessment poultryThermalIndex;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MandatoryAeratorSchedule {
        private boolean aeratorRunRequired;
        private String startTime;
        private String endTime;
        private int recommendedHours;
        private String reason;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PoultryThermalAssessment {
        private double thiValue;
        private String status;
        private String impact;
        private String recommendedIntervention;
    }
}

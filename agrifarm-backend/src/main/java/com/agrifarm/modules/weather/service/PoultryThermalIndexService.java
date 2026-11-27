package com.agrifarm.modules.weather.service;

import com.agrifarm.modules.weather.dto.WeatherSentinelRiskResponse.PoultryThermalAssessment;
import org.springframework.stereotype.Service;

/**
 * Computes ICAR-CARI Poultry Temperature-Humidity Index (THI):
 * THI = 0.8 * T + (RH / 100) * (T - 14.4) + 46.4
 */
@Service
public class PoultryThermalIndexService {

    public PoultryThermalAssessment assess(Double temperatureC, Integer humidityPercent) {
        double temp = temperatureC != null ? temperatureC : 28.0;
        double rh = humidityPercent != null ? humidityPercent : 60.0;

        double thi = 0.8 * temp + (rh / 100.0) * (temp - 14.4) + 46.4;
        double roundedThi = Math.round(thi * 100.0) / 100.0;

        if (roundedThi >= 82.0) {
            return PoultryThermalAssessment.builder()
                    .thiValue(roundedThi)
                    .status("EMERGENCY")
                    .impact("High mortality risk from heat prostration & respiratory alkalosis.")
                    .recommendedIntervention("Withdraw feed during hottest hours (11:00 AM - 04:00 PM); run foggers, fans, and supply chilled electrolyte water.")
                    .build();
        }
        if (roundedThi >= 76.0) {
            return PoultryThermalAssessment.builder()
                    .thiValue(roundedThi)
                    .status("DANGER")
                    .impact("Severe panting; feed intake drops by 15-20%.")
                    .recommendedIntervention("Turn on roof sprinklers and foggers; add Vitamin C & electrolytes (KCl, NaHCO3) to drinking water.")
                    .build();
        }
        if (roundedThi >= 70.0) {
            return PoultryThermalAssessment.builder()
                    .thiValue(roundedThi)
                    .status("ALERT")
                    .impact("Slight panting and increased water intake.")
                    .recommendedIntervention("Ensure continuous cool drinking water and activate shed ventilation fans.")
                    .build();
        }
        return PoultryThermalAssessment.builder()
                .thiValue(roundedThi)
                .status("COMFORT")
                .impact("Optimal feed intake and growth.")
                .recommendedIntervention("Maintain normal feeding and ventilation schedules.")
                .build();
    }
}

package com.agrifarm.modules.weather.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.farm.model.Farm;
import com.agrifarm.modules.farm.service.FarmService;
import com.agrifarm.modules.weather.dto.WeatherResponse;
import com.agrifarm.modules.weather.dto.WeatherSentinelRiskResponse;
import com.agrifarm.modules.weather.dto.WeatherSentinelRiskResponse.PoultryThermalAssessment;
import com.agrifarm.modules.weather.service.AeratorSchedulerService;
import com.agrifarm.modules.weather.service.NocturnalHypoxiaPredictor;
import com.agrifarm.modules.weather.service.PoultryThermalIndexService;
import com.agrifarm.modules.weather.service.WeatherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;
    private final FarmService farmService;
    private final NocturnalHypoxiaPredictor hypoxiaPredictor;
    private final AeratorSchedulerService aeratorSchedulerService;
    private final PoultryThermalIndexService poultryThermalIndexService;

    @GetMapping({"/api/weather", "/api/v1/weather"})
    public ResponseEntity<?> getWeather(
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude) {

        if (latitude == null || longitude == null) {
            log.warn("Weather request missing coordinates: lat={}, lng={}", latitude, longitude);
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "MISSING_COORDINATES",
                    "message", "Both latitude and longitude parameters are required."
            ));
        }

        try {
            WeatherResponse weather = weatherService.getFarmWeather(latitude, longitude);
            return ResponseEntity.ok(weather);
        } catch (Exception ex) {
            log.error("Failed to fetch weather for [{}, {}]: {}", latitude, longitude, ex.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "error", "WEATHER_UNAVAILABLE",
                    "message", "Unable to load weather data. Please try again later."
            ));
        }
    }

    @GetMapping("/api/v1/weather/risk/{farmId}")
    public ResponseEntity<ApiResponse<WeatherSentinelRiskResponse>> getFarmWeatherRisk(@PathVariable UUID farmId) {
        Farm farm = farmService.requireOwnedFarm(farmId);
        double lat = farm.getLatitude() != null ? farm.getLatitude() : 22.9747;
        double lng = farm.getLongitude() != null ? farm.getLongitude() : 75.8022;

        WeatherResponse weather = weatherService.getFarmWeather(lat, lng);
        NocturnalHypoxiaPredictor.HypoxiaPrediction prediction = hypoxiaPredictor.predictForFarm(farmId, weather);

        WeatherSentinelRiskResponse riskResponse = WeatherSentinelRiskResponse.builder()
                .currentTemperature(weather.getTemperature())
                .currentHumidity(weather.getHumidity())
                .nighttimeCloudCoverPercent(weather.getCloudCover() != null ? weather.getCloudCover() : 0)
                .nocturnalHypoxiaRiskIndex(prediction.riskIndex())
                .hypoxiaRiskLevel(prediction.riskLevel())
                .mandatoryAeratorSchedule(aeratorSchedulerService.buildSchedule(prediction))
                .poultryThermalIndex(poultryThermalIndexService.assess(weather.getTemperature(), weather.getHumidity()))
                .build();

        return ResponseEntity.ok(ApiResponse.success("Weather sentinel risk computed", riskResponse));
    }

    @GetMapping("/api/v1/weather/thi")
    public ResponseEntity<ApiResponse<PoultryThermalAssessment>> getPoultryThermalIndex(
            @RequestParam Double latitude,
            @RequestParam Double longitude
    ) {
        WeatherResponse weather = weatherService.getFarmWeather(latitude, longitude);
        PoultryThermalAssessment thi = poultryThermalIndexService.assess(weather.getTemperature(), weather.getHumidity());
        return ResponseEntity.ok(ApiResponse.success("Poultry Thermal Index computed", thi));
    }
}

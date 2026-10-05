package com.agrifarm.modules.weather.controller;

import com.agrifarm.modules.weather.dto.WeatherResponse;
import com.agrifarm.modules.weather.service.WeatherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

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
}

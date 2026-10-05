package com.agrifarm.modules.weather.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherResponse {
    private Double latitude;
    private Double longitude;
    private Double temperature;
    private Integer humidity;
    private Double windSpeed;
    private Integer weatherCode;
    private String weatherCondition;
    private Double maxTemperature;
    private Double minTemperature;
    private Double precipitation;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}

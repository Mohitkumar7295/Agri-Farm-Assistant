package com.agrifarm.modules.waterquality.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.waterquality.model.WaterTelemetryLog;
import com.agrifarm.modules.waterquality.service.WaterQualityService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/water-quality")
@RequiredArgsConstructor
public class WaterQualityController {

    private final WaterQualityService waterQualityService;

    @PostMapping("/telemetry")
    public ResponseEntity<ApiResponse<WaterTelemetryLog>> logTelemetry(@Valid @RequestBody WaterTelemetryDto dto) {
        WaterTelemetryLog saved = waterQualityService.logTelemetry(
                dto.getPondId(),
                dto.getDissolvedOxygen(),
                dto.getPh(),
                dto.getTemperatureCelsius(),
                dto.getAmmoniaTan(),
                dto.getNitrite(),
                dto.getTransparencyCm(),
                dto.getLoggedAt()
        );
        return ResponseEntity.ok(ApiResponse.success("Water telemetry recorded", saved));
    }

    @GetMapping("/telemetry/{pondId}")
    public ResponseEntity<ApiResponse<List<WaterTelemetryLog>>> listTelemetry(@PathVariable UUID pondId) {
        return ResponseEntity.ok(ApiResponse.success("Water telemetry retrieved", waterQualityService.listTelemetry(pondId)));
    }

    @Data
    public static class WaterTelemetryDto {
        @NotNull
        private UUID pondId;
        @NotNull
        private Double dissolvedOxygen;
        @NotNull
        private Double ph;
        @NotNull
        private Double temperatureCelsius;
        private Double ammoniaTan;
        private Double nitrite;
        private Double transparencyCm;
        private Instant loggedAt;
    }
}

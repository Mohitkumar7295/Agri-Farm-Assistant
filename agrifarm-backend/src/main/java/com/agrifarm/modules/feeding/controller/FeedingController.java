package com.agrifarm.modules.feeding.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.feeding.model.DailyFeedLog;
import com.agrifarm.modules.feeding.service.FeedingEngineService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/feeding")
@RequiredArgsConstructor
public class FeedingController {

    private final FeedingEngineService feedingService;

    @PostMapping("/logs")
    public ResponseEntity<ApiResponse<DailyFeedLog>> logFeed(@Valid @RequestBody FeedLogDto dto) {
        DailyFeedLog saved = feedingService.logFeed(
                dto.getEntityType(), dto.getEntityId(), dto.getFeedType(),
                dto.getQuantityKg(), dto.getFeedingSession(), dto.getCostPerKg()
        );
        return ResponseEntity.ok(ApiResponse.success("Feed log recorded", saved));
    }

    @GetMapping("/logs/{entityId}")
    public ResponseEntity<ApiResponse<List<DailyFeedLog>>> listLogs(@PathVariable UUID entityId) {
        return ResponseEntity.ok(ApiResponse.success("Feed logs retrieved", feedingService.listLogs(entityId)));
    }

    @GetMapping("/forecast/{entityId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> forecast(
            @PathVariable UUID entityId,
            @RequestParam(defaultValue = "1000.0") double biomassKg,
            @RequestParam(defaultValue = "2.5") double feedingRatePct,
            @RequestParam(defaultValue = "28.0") double tempC,
            @RequestParam(defaultValue = "6.0") double doMgL
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "10-day feed forecast generated",
                feedingService.forecast10Days(biomassKg, feedingRatePct, tempC, doMgL)
        ));
    }

    @Data
    public static class FeedLogDto {
        @NotBlank
        private String entityType;
        @NotNull
        private UUID entityId;
        @NotBlank
        private String feedType;
        @NotNull
        private Double quantityKg;
        private String feedingSession = "MORNING";
        private Double costPerKg;
    }
}

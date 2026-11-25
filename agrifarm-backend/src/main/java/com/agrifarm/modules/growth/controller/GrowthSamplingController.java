package com.agrifarm.modules.growth.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.growth.model.SamplingLog;
import com.agrifarm.modules.growth.service.GrowthCalculationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/growth")
@RequiredArgsConstructor
public class GrowthSamplingController {

    private final GrowthCalculationService growthService;

    @PostMapping("/sampling")
    public ResponseEntity<ApiResponse<SamplingLog>> recordSampling(@Valid @RequestBody WeightSamplingDto dto) {
        SamplingLog saved = growthService.recordSampling(
                dto.getEntityType(),
                dto.getBatchId(),
                dto.getSpecie(),
                dto.getSampleSizeCount(),
                dto.getAverageWeightGrams(),
                dto.getSamplingDate(),
                dto.getInitialWeightGrams() != null ? dto.getInitialWeightGrams() : 50.0,
                dto.getStartDate(),
                dto.getCurrentStockCount() != null ? dto.getCurrentStockCount() : 1000
        );
        return ResponseEntity.ok(ApiResponse.success("Growth sampling recorded", saved));
    }

    @GetMapping("/sampling/{batchId}")
    public ResponseEntity<ApiResponse<List<SamplingLog>>> listSamplings(@PathVariable UUID batchId) {
        return ResponseEntity.ok(ApiResponse.success("Sampling history retrieved", growthService.listSamplings(batchId)));
    }

    @Data
    public static class WeightSamplingDto {
        @NotBlank
        private String entityType;
        @NotNull
        private UUID batchId;
        private String specie;
        @NotNull
        @Min(1)
        private Integer sampleSizeCount;
        @NotNull
        private Double averageWeightGrams;
        private LocalDate samplingDate;
        private Double initialWeightGrams;
        private LocalDate startDate;
        private Integer currentStockCount;
    }
}

package com.agrifarm.modules.fisheries.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class FishBatchCreateDto {
    @NotBlank(message = "batchCode is required")
    private String batchCode;

    @NotNull(message = "stockingDate is required")
    private LocalDate stockingDate;

    @NotEmpty(message = "At least one stocked specie is required")
    @Valid
    private List<StockingSpecieDto> stocks;

    @Data
    public static class StockingSpecieDto {
        @NotBlank(message = "specie is required")
        private String specie;

        @NotNull(message = "quantity is required")
        private Integer quantity;

        @NotNull(message = "initialAvgWeightGrams is required")
        private Double initialAvgWeightGrams;
    }
}

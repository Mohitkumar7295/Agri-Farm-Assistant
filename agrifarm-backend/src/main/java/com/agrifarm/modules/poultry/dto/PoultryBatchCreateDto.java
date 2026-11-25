package com.agrifarm.modules.poultry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PoultryBatchCreateDto {
    @NotBlank(message = "batchCode is required")
    private String batchCode;

    @NotBlank(message = "breed is required")
    private String breed;

    private String category = "BROILER";

    @NotNull(message = "initialQuantity is required")
    private Integer initialQuantity;

    @NotNull(message = "hatchDate is required")
    private LocalDate hatchDate;

    @NotNull(message = "initialAvgWeightGrams is required")
    private Double initialAvgWeightGrams;
}

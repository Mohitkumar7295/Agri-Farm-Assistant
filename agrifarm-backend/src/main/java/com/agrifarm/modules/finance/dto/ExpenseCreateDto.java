package com.agrifarm.modules.finance.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ExpenseCreateDto {

    @NotNull(message = "Farm ID is required")
    private UUID farmId;

    @NotBlank(message = "Domain is required (FISHERIES, POULTRY, GENERAL)")
    private String domain;

    @NotBlank(message = "Category is required (FEED, SEED, MEDICINE, ELECTRICITY, LABOR, OTHER)")
    private String category;

    @NotNull(message = "Amount in INR is required")
    @DecimalMin(value = "0.00", message = "Amount must be >= 0")
    private BigDecimal amountInr;

    private String description;

    private LocalDate incurredOn;
}

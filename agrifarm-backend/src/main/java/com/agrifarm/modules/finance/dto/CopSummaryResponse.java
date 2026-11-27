package com.agrifarm.modules.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CopSummaryResponse {
    private UUID farmId;
    private BigDecimal totalExpenseInr;
    private BigDecimal fisheriesExpenseInr;
    private BigDecimal poultryExpenseInr;
    private BigDecimal generalExpenseInr;
    private double estimatedFishBiomassKg;
    private double estimatedPoultryBiomassKg;
    private double totalBiomassKg;
    private BigDecimal fishCostPerKgInr;
    private BigDecimal poultryCostPerKgInr;
    private BigDecimal overallCostPerKgInr;
    private Map<String, BigDecimal> expenseByCategory;
}

package com.agrifarm.modules.finance.service;

import com.agrifarm.common.exception.TenantViolationException;
import com.agrifarm.modules.farm.service.FarmService;
import com.agrifarm.modules.finance.dto.CopSummaryResponse;
import com.agrifarm.modules.finance.dto.ExpenseCreateDto;
import com.agrifarm.modules.finance.model.ExpenseRecord;
import com.agrifarm.modules.finance.repository.ExpenseRepository;
import com.agrifarm.modules.fisheries.model.FishBatch;
import com.agrifarm.modules.fisheries.model.PolycultureStock;
import com.agrifarm.modules.fisheries.model.Pond;
import com.agrifarm.modules.fisheries.repository.FishBatchRepository;
import com.agrifarm.modules.fisheries.repository.PolycultureStockRepository;
import com.agrifarm.modules.fisheries.repository.PondRepository;
import com.agrifarm.modules.poultry.model.PoultryBatch;
import com.agrifarm.modules.poultry.model.PoultryShed;
import com.agrifarm.modules.poultry.repository.PoultryBatchRepository;
import com.agrifarm.modules.poultry.repository.PoultryShedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final ExpenseRepository expenseRepository;
    private final FarmService farmService;
    private final PondRepository pondRepository;
    private final FishBatchRepository fishBatchRepository;
    private final PolycultureStockRepository polycultureStockRepository;
    private final PoultryShedRepository poultryShedRepository;
    private final PoultryBatchRepository poultryBatchRepository;

    @Transactional
    public ExpenseRecord recordExpense(ExpenseCreateDto dto) {
        farmService.requireOwnedFarm(dto.getFarmId());
        UUID userId = farmService.requireCurrentUserId();

        ExpenseRecord record = ExpenseRecord.builder()
                .farmId(dto.getFarmId())
                .userId(userId)
                .domain(dto.getDomain().trim().toUpperCase())
                .category(dto.getCategory().trim().toUpperCase())
                .amountInr(dto.getAmountInr())
                .description(dto.getDescription())
                .incurredOn(dto.getIncurredOn() != null ? dto.getIncurredOn() : LocalDate.now())
                .build();

        return expenseRepository.save(record);
    }

    public List<ExpenseRecord> listExpenses(UUID farmId) {
        UUID userId = farmService.requireCurrentUserId();
        if (farmId != null) {
            farmService.requireOwnedFarm(farmId);
            return expenseRepository.findAllByFarmIdAndUserIdOrderByIncurredOnDesc(farmId, userId);
        }
        return expenseRepository.findAllByUserIdOrderByIncurredOnDesc(userId);
    }

    @Transactional
    public void deleteExpense(UUID expenseId) {
        UUID userId = farmService.requireCurrentUserId();
        ExpenseRecord record = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Expense record not found: " + expenseId));
        if (!record.getUserId().equals(userId)) {
            throw new TenantViolationException("Access denied to expense record: " + expenseId);
        }
        expenseRepository.delete(record);
    }

    public CopSummaryResponse calculateCostOfProduction(UUID farmId) {
        farmService.requireOwnedFarm(farmId);
        UUID userId = farmService.requireCurrentUserId();

        List<ExpenseRecord> expenses = expenseRepository.findAllByFarmIdAndUserIdOrderByIncurredOnDesc(farmId, userId);

        BigDecimal fisheriesTotal = BigDecimal.ZERO;
        BigDecimal poultryTotal = BigDecimal.ZERO;
        BigDecimal generalTotal = BigDecimal.ZERO;
        Map<String, BigDecimal> byCategory = new LinkedHashMap<>();

        for (ExpenseRecord exp : expenses) {
            BigDecimal amount = exp.getAmountInr() != null ? exp.getAmountInr() : BigDecimal.ZERO;
            String domain = exp.getDomain() != null ? exp.getDomain().toUpperCase() : "GENERAL";
            switch (domain) {
                case "FISHERIES" -> fisheriesTotal = fisheriesTotal.add(amount);
                case "POULTRY" -> poultryTotal = poultryTotal.add(amount);
                default -> generalTotal = generalTotal.add(amount);
            }
            String category = exp.getCategory() != null ? exp.getCategory().toUpperCase() : "OTHER";
            byCategory.merge(category, amount, BigDecimal::add);
        }

        BigDecimal totalExpense = fisheriesTotal.add(poultryTotal).add(generalTotal);
        double fishBiomassKg = computeFishBiomassKg(farmId);
        double poultryBiomassKg = computePoultryBiomassKg(farmId);
        double totalBiomassKg = Math.round((fishBiomassKg + poultryBiomassKg) * 100.0) / 100.0;

        return CopSummaryResponse.builder()
                .farmId(farmId)
                .totalExpenseInr(totalExpense)
                .fisheriesExpenseInr(fisheriesTotal)
                .poultryExpenseInr(poultryTotal)
                .generalExpenseInr(generalTotal)
                .estimatedFishBiomassKg(Math.round(fishBiomassKg * 100.0) / 100.0)
                .estimatedPoultryBiomassKg(Math.round(poultryBiomassKg * 100.0) / 100.0)
                .totalBiomassKg(totalBiomassKg)
                .fishCostPerKgInr(divideSafe(fisheriesTotal, fishBiomassKg))
                .poultryCostPerKgInr(divideSafe(poultryTotal, poultryBiomassKg))
                .overallCostPerKgInr(divideSafe(totalExpense, totalBiomassKg))
                .expenseByCategory(byCategory)
                .build();
    }

    private double computeFishBiomassKg(UUID farmId) {
        double grams = 0.0;
        for (Pond pond : pondRepository.findAllByFarmId(farmId)) {
            for (FishBatch batch : fishBatchRepository.findAllByPondId(pond.getId())) {
                if (!"ACTIVE".equalsIgnoreCase(batch.getStatus())) continue;
                for (PolycultureStock stock : polycultureStockRepository.findAllByFishBatchId(batch.getId())) {
                    grams += stock.getCurrentQuantity() * stock.getCurrentAvgWeightGrams();
                }
            }
        }
        return grams / 1000.0;
    }

    private double computePoultryBiomassKg(UUID farmId) {
        double grams = 0.0;
        for (PoultryShed shed : poultryShedRepository.findAllByFarmId(farmId)) {
            for (PoultryBatch batch : poultryBatchRepository.findAllByShedId(shed.getId())) {
                if (!"ACTIVE".equalsIgnoreCase(batch.getStatus())) continue;
                grams += batch.getCurrentQuantity() * batch.getCurrentAvgWeightGrams();
            }
        }
        return grams / 1000.0;
    }

    private BigDecimal divideSafe(BigDecimal cost, double biomassKg) {
        if (biomassKg <= 0.0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return cost.divide(BigDecimal.valueOf(biomassKg), 2, RoundingMode.HALF_UP);
    }
}

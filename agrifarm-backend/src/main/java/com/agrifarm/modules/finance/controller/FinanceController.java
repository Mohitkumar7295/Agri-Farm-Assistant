package com.agrifarm.modules.finance.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.finance.dto.CopSummaryResponse;
import com.agrifarm.modules.finance.dto.ExpenseCreateDto;
import com.agrifarm.modules.finance.model.ExpenseRecord;
import com.agrifarm.modules.finance.service.FinanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    @PostMapping("/expenses")
    public ResponseEntity<ApiResponse<ExpenseRecord>> createExpense(@Valid @RequestBody ExpenseCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Expense recorded successfully", financeService.recordExpense(dto)));
    }

    @GetMapping("/expenses")
    public ResponseEntity<ApiResponse<List<ExpenseRecord>>> listExpenses(@RequestParam(required = false) UUID farmId) {
        return ResponseEntity.ok(ApiResponse.success("Expenses retrieved successfully", financeService.listExpenses(farmId)));
    }

    @DeleteMapping("/expenses/{expenseId}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable UUID expenseId) {
        financeService.deleteExpense(expenseId);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully", null));
    }

    @GetMapping("/cop/{farmId}")
    public ResponseEntity<ApiResponse<CopSummaryResponse>> getCostOfProduction(@PathVariable UUID farmId) {
        return ResponseEntity.ok(ApiResponse.success("Cost of Production calculated", financeService.calculateCostOfProduction(farmId)));
    }
}

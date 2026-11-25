package com.agrifarm.modules.poultry.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.poultry.dto.PoultryBatchCreateDto;
import com.agrifarm.modules.poultry.dto.ShedCreateDto;
import com.agrifarm.modules.poultry.model.PoultryBatch;
import com.agrifarm.modules.poultry.model.PoultryShed;
import com.agrifarm.modules.poultry.model.VaccineSchedule;
import com.agrifarm.modules.poultry.service.PoultryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/poultry")
@RequiredArgsConstructor
public class PoultryController {

    private final PoultryService poultryService;

    @PostMapping("/sheds")
    public ResponseEntity<ApiResponse<PoultryShed>> createShed(@Valid @RequestBody ShedCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Poultry shed created successfully", poultryService.createShed(dto)));
    }

    @GetMapping("/sheds")
    public ResponseEntity<ApiResponse<List<PoultryShed>>> listSheds(@RequestParam UUID farmId) {
        return ResponseEntity.ok(ApiResponse.success("Poultry sheds retrieved successfully", poultryService.listSheds(farmId)));
    }

    @PostMapping("/sheds/{shedId}/batches")
    public ResponseEntity<ApiResponse<PoultryBatch>> stockBatch(
            @PathVariable UUID shedId,
            @Valid @RequestBody PoultryBatchCreateDto dto
    ) {
        return ResponseEntity.ok(ApiResponse.success("Poultry batch stocked successfully", poultryService.stockBatch(shedId, dto)));
    }

    @GetMapping("/sheds/{shedId}/batches")
    public ResponseEntity<ApiResponse<List<PoultryBatch>>> listBatches(@PathVariable UUID shedId) {
        return ResponseEntity.ok(ApiResponse.success("Poultry batches retrieved successfully", poultryService.listBatches(shedId)));
    }

    @GetMapping("/batches/{batchId}/vaccines")
    public ResponseEntity<ApiResponse<List<VaccineSchedule>>> listVaccines(@PathVariable UUID batchId) {
        return ResponseEntity.ok(ApiResponse.success("Vaccination schedule retrieved", poultryService.listVaccines(batchId)));
    }

    @PatchMapping("/vaccines/{vaccineId}/complete")
    public ResponseEntity<ApiResponse<VaccineSchedule>> completeVaccine(@PathVariable UUID vaccineId) {
        return ResponseEntity.ok(ApiResponse.success("Vaccine marked administered", poultryService.markVaccineAdministered(vaccineId)));
    }
}

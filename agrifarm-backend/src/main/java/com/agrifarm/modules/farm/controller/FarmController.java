package com.agrifarm.modules.farm.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.farm.dto.FarmCreateDto;
import com.agrifarm.modules.farm.model.Farm;
import com.agrifarm.modules.farm.service.FarmService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/farms")
@RequiredArgsConstructor
public class FarmController {

    private final FarmService farmService;

    @PostMapping
    public ResponseEntity<ApiResponse<Farm>> createFarm(@Valid @RequestBody FarmCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Farm created successfully", farmService.createFarm(dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Farm>>> listFarms() {
        return ResponseEntity.ok(ApiResponse.success("Farms retrieved successfully", farmService.listFarms()));
    }

    @DeleteMapping("/{farmId}")
    public ResponseEntity<ApiResponse<Void>> deleteFarm(@PathVariable UUID farmId) {
        farmService.softDeleteFarm(farmId);
        return ResponseEntity.ok(ApiResponse.success("Farm deleted successfully", null));
    }
}

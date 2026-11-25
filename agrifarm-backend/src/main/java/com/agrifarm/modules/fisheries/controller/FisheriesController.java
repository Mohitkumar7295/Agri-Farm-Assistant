package com.agrifarm.modules.fisheries.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.fisheries.dto.FishBatchCreateDto;
import com.agrifarm.modules.fisheries.dto.PondCreateDto;
import com.agrifarm.modules.fisheries.model.FishBatch;
import com.agrifarm.modules.fisheries.model.Pond;
import com.agrifarm.modules.fisheries.service.FisheriesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/fisheries")
@RequiredArgsConstructor
public class FisheriesController {

    private final FisheriesService fisheriesService;

    @PostMapping("/ponds")
    public ResponseEntity<ApiResponse<Pond>> createPond(@Valid @RequestBody PondCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Pond created successfully", fisheriesService.createPond(dto)));
    }

    @GetMapping("/ponds")
    public ResponseEntity<ApiResponse<List<Pond>>> listPonds(@RequestParam UUID farmId) {
        return ResponseEntity.ok(ApiResponse.success("Ponds retrieved successfully", fisheriesService.listPonds(farmId)));
    }

    @PostMapping("/ponds/{pondId}/batches")
    public ResponseEntity<ApiResponse<FishBatch>> stockBatch(
            @PathVariable UUID pondId,
            @Valid @RequestBody FishBatchCreateDto dto
    ) {
        return ResponseEntity.ok(ApiResponse.success("Fish batch stocked successfully", fisheriesService.stockBatch(pondId, dto)));
    }

    @GetMapping("/ponds/{pondId}/batches")
    public ResponseEntity<ApiResponse<List<FishBatch>>> listBatches(@PathVariable UUID pondId) {
        return ResponseEntity.ok(ApiResponse.success("Fish batches retrieved successfully", fisheriesService.listBatches(pondId)));
    }
}

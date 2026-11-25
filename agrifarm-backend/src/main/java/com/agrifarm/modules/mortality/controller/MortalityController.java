package com.agrifarm.modules.mortality.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.mortality.model.MortalityRecord;
import com.agrifarm.modules.mortality.service.SafeMortalityService;
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
@RequestMapping("/api/v1/mortality")
@RequiredArgsConstructor
public class MortalityController {

    private final SafeMortalityService mortalityService;

    @PostMapping("/record")
    public ResponseEntity<ApiResponse<MortalityRecord>> record(@Valid @RequestBody MortalityLogDto dto) {
        MortalityRecord saved = mortalityService.recordMortality(
                dto.getEntityType(),
                dto.getEntityId(),
                dto.getDeadCount(),
                dto.getSuspectedCause(),
                dto.getObservationNotes(),
                dto.getLogDate()
        );
        return ResponseEntity.ok(ApiResponse.success("Mortality recorded safely", saved));
    }

    @GetMapping("/{entityId}")
    public ResponseEntity<ApiResponse<List<MortalityRecord>>> history(@PathVariable UUID entityId) {
        return ResponseEntity.ok(ApiResponse.success("Mortality history retrieved", mortalityService.listHistory(entityId)));
    }

    @Data
    public static class MortalityLogDto {
        @NotBlank
        private String entityType;
        @NotNull
        private UUID entityId;
        @NotNull
        @Min(1)
        private Integer deadCount;
        private String suspectedCause;
        private String observationNotes;
        private LocalDate logDate;
    }
}

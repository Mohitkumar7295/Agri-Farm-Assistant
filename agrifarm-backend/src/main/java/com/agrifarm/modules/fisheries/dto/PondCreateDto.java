package com.agrifarm.modules.fisheries.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class PondCreateDto {
    @NotNull(message = "farmId is required")
    private UUID farmId;

    @NotBlank(message = "Pond name is required")
    private String name;

    @NotNull(message = "waterAreaAcres is required")
    private Double waterAreaAcres;

    @NotNull(message = "depthFeet is required")
    private Double depthFeet;

    private Boolean hasAerator = false;
    private Double aeratorHp = 0.0;
}

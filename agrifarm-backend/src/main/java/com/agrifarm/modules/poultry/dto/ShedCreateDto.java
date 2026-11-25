package com.agrifarm.modules.poultry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ShedCreateDto {
    @NotNull(message = "farmId is required")
    private UUID farmId;

    @NotBlank(message = "shedName is required")
    private String shedName;

    private String shedType = "OPEN_SIDED";

    @NotNull(message = "lengthFeet is required")
    private Double lengthFeet;

    @NotNull(message = "widthFeet is required")
    private Double widthFeet;

    @NotNull(message = "capacityBirds is required")
    private Integer capacityBirds;

    private Boolean hasFoggers = false;
}

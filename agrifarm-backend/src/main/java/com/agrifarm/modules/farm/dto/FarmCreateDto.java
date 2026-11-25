package com.agrifarm.modules.farm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FarmCreateDto {
    @NotBlank(message = "Farm name is required")
    private String name;
    private String domain = "INTEGRATED";
    private Double latitude;
    private Double longitude;
    private String address;
    private Double totalAreaAcres;
}

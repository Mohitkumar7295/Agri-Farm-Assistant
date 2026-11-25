package com.agrifarm.modules.farm.service;

import com.agrifarm.common.exception.TenantViolationException;
import com.agrifarm.config.TenantContextHolder;
import com.agrifarm.modules.farm.dto.FarmCreateDto;
import com.agrifarm.modules.farm.model.Farm;
import com.agrifarm.modules.farm.repository.FarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FarmService {

    private final FarmRepository farmRepository;

    public UUID requireCurrentUserId() {
        UUID userId = TenantContextHolder.getTenantId();
        if (userId == null) {
            throw new SecurityException("Authentication required");
        }
        return userId;
    }

    public Farm requireOwnedFarm(UUID farmId) {
        UUID userId = requireCurrentUserId();
        Farm farm = farmRepository.findByIdAndDeletedAtIsNull(farmId)
                .orElseThrow(() -> new IllegalArgumentException("Farm not found: " + farmId));
        if (!farm.getUserId().equals(userId)) {
            throw new TenantViolationException("Access denied to farm: " + farmId);
        }
        return farm;
    }

    @Transactional
    public Farm createFarm(FarmCreateDto dto) {
        UUID userId = requireCurrentUserId();
        Farm farm = Farm.builder()
                .userId(userId)
                .name(dto.getName().trim())
                .domain(dto.getDomain() != null ? dto.getDomain().toUpperCase() : "INTEGRATED")
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .address(dto.getAddress())
                .totalAreaAcres(dto.getTotalAreaAcres())
                .build();
        return farmRepository.save(farm);
    }

    public List<Farm> listFarms() {
        return farmRepository.findAllByUserIdAndDeletedAtIsNull(requireCurrentUserId());
    }

    @Transactional
    public void softDeleteFarm(UUID farmId) {
        Farm farm = requireOwnedFarm(farmId);
        farm.setDeletedAt(Instant.now());
        farmRepository.save(farm);
    }
}

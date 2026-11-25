package com.agrifarm.modules.fisheries.service;

import com.agrifarm.modules.farm.service.FarmService;
import com.agrifarm.modules.fisheries.dto.FishBatchCreateDto;
import com.agrifarm.modules.fisheries.dto.PondCreateDto;
import com.agrifarm.modules.fisheries.model.FishBatch;
import com.agrifarm.modules.fisheries.model.PolycultureStock;
import com.agrifarm.modules.fisheries.model.Pond;
import com.agrifarm.modules.fisheries.repository.FishBatchRepository;
import com.agrifarm.modules.fisheries.repository.PolycultureStockRepository;
import com.agrifarm.modules.fisheries.repository.PondRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FisheriesService {

    private final PondRepository pondRepository;
    private final FishBatchRepository fishBatchRepository;
    private final PolycultureStockRepository stockRepository;
    private final FarmService farmService;

    @Transactional
    public Pond createPond(PondCreateDto dto) {
        farmService.requireOwnedFarm(dto.getFarmId());
        Pond pond = Pond.builder()
                .farmId(dto.getFarmId())
                .name(dto.getName().trim())
                .waterAreaAcres(dto.getWaterAreaAcres())
                .depthFeet(dto.getDepthFeet())
                .hasAerator(Boolean.TRUE.equals(dto.getHasAerator()))
                .aeratorHp(dto.getAeratorHp() != null ? dto.getAeratorHp() : 0.0)
                .build();
        return pondRepository.save(pond);
    }

    public List<Pond> listPonds(UUID farmId) {
        farmService.requireOwnedFarm(farmId);
        return pondRepository.findAllByFarmId(farmId);
    }

    public Pond requireOwnedPond(UUID pondId) {
        Pond pond = pondRepository.findById(pondId)
                .orElseThrow(() -> new IllegalArgumentException("Pond not found: " + pondId));
        farmService.requireOwnedFarm(pond.getFarmId());
        return pond;
    }

    @Transactional
    public FishBatch stockBatch(UUID pondId, FishBatchCreateDto dto) {
        requireOwnedPond(pondId);
        FishBatch batch = fishBatchRepository.save(FishBatch.builder()
                .pondId(pondId)
                .batchCode(dto.getBatchCode().trim())
                .stockingDate(dto.getStockingDate())
                .status("ACTIVE")
                .build());

        List<PolycultureStock> stocks = dto.getStocks().stream()
                .map(s -> PolycultureStock.builder()
                        .fishBatchId(batch.getId())
                        .specie(s.getSpecie().trim().toUpperCase())
                        .initialQuantity(s.getQuantity())
                        .currentQuantity(s.getQuantity())
                        .initialAvgWeightGrams(s.getInitialAvgWeightGrams())
                        .currentAvgWeightGrams(s.getInitialAvgWeightGrams())
                        .build())
                .toList();

        batch.setStocks(stockRepository.saveAll(stocks));
        return batch;
    }

    public List<FishBatch> listBatches(UUID pondId) {
        requireOwnedPond(pondId);
        return fishBatchRepository.findAllByPondId(pondId);
    }
}

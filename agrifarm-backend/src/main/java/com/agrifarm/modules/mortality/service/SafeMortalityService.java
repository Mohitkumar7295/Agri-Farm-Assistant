package com.agrifarm.modules.mortality.service;

import com.agrifarm.common.exception.StockUnderflowException;
import com.agrifarm.modules.farm.service.FarmService;
import com.agrifarm.modules.fisheries.model.PolycultureStock;
import com.agrifarm.modules.fisheries.repository.PolycultureStockRepository;
import com.agrifarm.modules.mortality.model.MortalityRecord;
import com.agrifarm.modules.mortality.repository.MortalityRepository;
import com.agrifarm.modules.poultry.model.PoultryBatch;
import com.agrifarm.modules.poultry.repository.PoultryBatchRepository;
import com.agrifarm.modules.poultry.service.PoultryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SafeMortalityService {

    private final MortalityRepository mortalityRepository;
    private final PoultryBatchRepository poultryBatchRepository;
    private final PolycultureStockRepository polycultureStockRepository;
    private final FarmService farmService;
    private final PoultryService poultryService;

    @Transactional
    public MortalityRecord recordMortality(
            String entityType,
            UUID entityId,
            int deadCount,
            String suspectedCause,
            String observationNotes,
            LocalDate logDate
    ) {
        if (deadCount <= 0) {
            throw new IllegalArgumentException("deadCount must be greater than 0");
        }
        UUID userId = farmService.requireCurrentUserId();
        String normalizedType = entityType.trim().toUpperCase();

        if ("POULTRY_BATCH".equals(normalizedType)) {
            PoultryBatch batch = poultryBatchRepository.findByIdForUpdate(entityId)
                    .orElseThrow(() -> new IllegalArgumentException("Poultry batch not found: " + entityId));
            poultryService.requireOwnedShed(batch.getShedId());
            if (batch.getCurrentQuantity() < deadCount) {
                throw new StockUnderflowException(
                        "Cannot record " + deadCount + " mortalities. Current poultry count is " + batch.getCurrentQuantity() + "."
                );
            }
            batch.setCurrentQuantity(batch.getCurrentQuantity() - deadCount);
            poultryBatchRepository.save(batch);
        } else if ("POLYCULTURE_STOCK".equals(normalizedType) || "FISHERIES_STOCK".equals(normalizedType)) {
            PolycultureStock stock = polycultureStockRepository.findByIdForUpdate(entityId)
                    .orElseThrow(() -> new IllegalArgumentException("Fish stock not found: " + entityId));
            if (stock.getCurrentQuantity() < deadCount) {
                throw new StockUnderflowException(
                        "Cannot record " + deadCount + " mortalities. Current fish count is " + stock.getCurrentQuantity() + "."
                );
            }
            stock.setCurrentQuantity(stock.getCurrentQuantity() - deadCount);
            polycultureStockRepository.save(stock);
        } else {
            throw new IllegalArgumentException("Unsupported entityType: " + entityType);
        }

        MortalityRecord record = MortalityRecord.builder()
                .userId(userId)
                .entityType(normalizedType)
                .entityId(entityId)
                .deadCount(deadCount)
                .suspectedCause(suspectedCause)
                .observationNotes(observationNotes)
                .logDate(logDate != null ? logDate : LocalDate.now())
                .build();
        return mortalityRepository.save(record);
    }

    public List<MortalityRecord> listHistory(UUID entityId) {
        farmService.requireCurrentUserId();
        return mortalityRepository.findAllByEntityIdOrderByLogDateDesc(entityId);
    }
}

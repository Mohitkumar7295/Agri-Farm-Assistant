package com.agrifarm.modules.poultry.service;

import com.agrifarm.modules.farm.service.FarmService;
import com.agrifarm.modules.poultry.dto.PoultryBatchCreateDto;
import com.agrifarm.modules.poultry.dto.ShedCreateDto;
import com.agrifarm.modules.poultry.model.PoultryBatch;
import com.agrifarm.modules.poultry.model.PoultryShed;
import com.agrifarm.modules.poultry.model.VaccineSchedule;
import com.agrifarm.modules.poultry.repository.PoultryBatchRepository;
import com.agrifarm.modules.poultry.repository.PoultryShedRepository;
import com.agrifarm.modules.poultry.repository.VaccineScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PoultryService {

    private final PoultryShedRepository shedRepository;
    private final PoultryBatchRepository batchRepository;
    private final VaccineScheduleRepository vaccineRepository;
    private final FarmService farmService;

    @Transactional
    public PoultryShed createShed(ShedCreateDto dto) {
        farmService.requireOwnedFarm(dto.getFarmId());
        PoultryShed shed = PoultryShed.builder()
                .farmId(dto.getFarmId())
                .shedName(dto.getShedName().trim())
                .shedType(dto.getShedType() != null ? dto.getShedType().toUpperCase() : "OPEN_SIDED")
                .lengthFeet(dto.getLengthFeet())
                .widthFeet(dto.getWidthFeet())
                .capacityBirds(dto.getCapacityBirds())
                .hasFoggers(Boolean.TRUE.equals(dto.getHasFoggers()))
                .build();
        return shedRepository.save(shed);
    }

    public List<PoultryShed> listSheds(UUID farmId) {
        farmService.requireOwnedFarm(farmId);
        return shedRepository.findAllByFarmId(farmId);
    }

    public PoultryShed requireOwnedShed(UUID shedId) {
        PoultryShed shed = shedRepository.findById(shedId)
                .orElseThrow(() -> new IllegalArgumentException("Poultry shed not found: " + shedId));
        farmService.requireOwnedFarm(shed.getFarmId());
        return shed;
    }

    @Transactional
    public PoultryBatch stockBatch(UUID shedId, PoultryBatchCreateDto dto) {
        requireOwnedShed(shedId);
        PoultryBatch batch = batchRepository.save(PoultryBatch.builder()
                .shedId(shedId)
                .batchCode(dto.getBatchCode().trim())
                .breed(dto.getBreed().trim())
                .category(dto.getCategory() != null ? dto.getCategory().toUpperCase() : "BROILER")
                .initialQuantity(dto.getInitialQuantity())
                .currentQuantity(dto.getInitialQuantity())
                .hatchDate(dto.getHatchDate())
                .initialAvgWeightGrams(dto.getInitialAvgWeightGrams())
                .currentAvgWeightGrams(dto.getInitialAvgWeightGrams())
                .status("ACTIVE")
                .build());

        // Auto-seed ICAR-CARI / DAHD India Vaccination Schedule
        LocalDate hatch = dto.getHatchDate();
        List<VaccineSchedule> defaults = List.of(
                VaccineSchedule.builder().poultryBatchId(batch.getId()).vaccineName("Marek's (HVT)").diseasePrevented("Marek's Disease").scheduledDate(hatch.plusDays(1)).withdrawalDays(0).build(),
                VaccineSchedule.builder().poultryBatchId(batch.getId()).vaccineName("Ranikhet F-1 / LaSota").diseasePrevented("Newcastle Disease").scheduledDate(hatch.plusDays(6)).withdrawalDays(0).build(),
                VaccineSchedule.builder().poultryBatchId(batch.getId()).vaccineName("IBD (Georgia)").diseasePrevented("Infectious Bursal Disease").scheduledDate(hatch.plusDays(13)).withdrawalDays(0).build(),
                VaccineSchedule.builder().poultryBatchId(batch.getId()).vaccineName("Ranikhet Booster").diseasePrevented("Newcastle Disease").scheduledDate(hatch.plusDays(22)).withdrawalDays(0).build(),
                VaccineSchedule.builder().poultryBatchId(batch.getId()).vaccineName("Fowl Pox").diseasePrevented("Fowl Pox").scheduledDate(hatch.plusDays(42)).withdrawalDays(21).build()
        );
        vaccineRepository.saveAll(defaults);
        return batch;
    }

    public List<PoultryBatch> listBatches(UUID shedId) {
        requireOwnedShed(shedId);
        return batchRepository.findAllByShedId(shedId);
    }

    public List<VaccineSchedule> listVaccines(UUID batchId) {
        PoultryBatch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Poultry batch not found: " + batchId));
        requireOwnedShed(batch.getShedId());
        return vaccineRepository.findAllByPoultryBatchIdOrderByScheduledDateAsc(batchId);
    }

    @Transactional
    public VaccineSchedule markVaccineAdministered(UUID vaccineId) {
        VaccineSchedule schedule = vaccineRepository.findById(vaccineId)
                .orElseThrow(() -> new IllegalArgumentException("Vaccine schedule not found: " + vaccineId));
        PoultryBatch batch = batchRepository.findById(schedule.getPoultryBatchId())
                .orElseThrow(() -> new IllegalArgumentException("Poultry batch not found"));
        requireOwnedShed(batch.getShedId());
        schedule.setAdministered(true);
        schedule.setAdministeredDate(LocalDate.now());
        return vaccineRepository.save(schedule);
    }
}

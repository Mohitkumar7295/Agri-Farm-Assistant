package com.agrifarm.modules.poultry.repository;

import com.agrifarm.modules.poultry.model.VaccineSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VaccineScheduleRepository extends JpaRepository<VaccineSchedule, UUID> {
    List<VaccineSchedule> findAllByPoultryBatchIdOrderByScheduledDateAsc(UUID poultryBatchId);
}

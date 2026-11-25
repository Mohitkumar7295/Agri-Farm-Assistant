package com.agrifarm.modules.health.repository;

import com.agrifarm.modules.health.model.TreatmentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TreatmentRecordRepository extends JpaRepository<TreatmentRecord, UUID> {
    List<TreatmentRecord> findAllByEntityIdOrderByAdministeredAtDesc(UUID entityId);
}

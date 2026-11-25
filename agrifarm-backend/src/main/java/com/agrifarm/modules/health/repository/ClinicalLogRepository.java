package com.agrifarm.modules.health.repository;

import com.agrifarm.modules.health.model.ClinicalLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClinicalLogRepository extends JpaRepository<ClinicalLog, UUID> {
    List<ClinicalLog> findAllByEntityIdOrderByObservedAtDesc(UUID entityId);
}

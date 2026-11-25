package com.agrifarm.modules.waterquality.repository;

import com.agrifarm.modules.waterquality.model.WaterTelemetryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WaterTelemetryRepository extends JpaRepository<WaterTelemetryLog, UUID> {
    List<WaterTelemetryLog> findAllByPondIdOrderByLoggedAtDesc(UUID pondId);
}

package com.agrifarm.modules.growth.repository;

import com.agrifarm.modules.growth.model.SamplingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SamplingLogRepository extends JpaRepository<SamplingLog, UUID> {
    List<SamplingLog> findAllByBatchIdOrderBySamplingDateDesc(UUID batchId);
}

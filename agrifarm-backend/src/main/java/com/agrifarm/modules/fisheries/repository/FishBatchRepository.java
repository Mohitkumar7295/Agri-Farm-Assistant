package com.agrifarm.modules.fisheries.repository;

import com.agrifarm.modules.fisheries.model.FishBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FishBatchRepository extends JpaRepository<FishBatch, UUID> {
    List<FishBatch> findAllByPondId(UUID pondId);
}

package com.agrifarm.modules.mortality.repository;

import com.agrifarm.modules.mortality.model.MortalityRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MortalityRepository extends JpaRepository<MortalityRecord, UUID> {
    List<MortalityRecord> findAllByEntityIdOrderByLogDateDesc(UUID entityId);
}

package com.agrifarm.modules.poultry.repository;

import com.agrifarm.modules.poultry.model.PoultryShed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PoultryShedRepository extends JpaRepository<PoultryShed, UUID> {
    List<PoultryShed> findAllByFarmId(UUID farmId);
}

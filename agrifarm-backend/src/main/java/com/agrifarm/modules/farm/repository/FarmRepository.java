package com.agrifarm.modules.farm.repository;

import com.agrifarm.modules.farm.model.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FarmRepository extends JpaRepository<Farm, UUID> {
    List<Farm> findAllByUserIdAndDeletedAtIsNull(UUID userId);
    Optional<Farm> findByIdAndDeletedAtIsNull(UUID id);
}

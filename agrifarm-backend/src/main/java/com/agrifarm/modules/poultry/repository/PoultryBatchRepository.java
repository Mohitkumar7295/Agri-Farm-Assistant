package com.agrifarm.modules.poultry.repository;

import com.agrifarm.modules.poultry.model.PoultryBatch;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PoultryBatchRepository extends JpaRepository<PoultryBatch, UUID> {
    List<PoultryBatch> findAllByShedId(UUID shedId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM PoultryBatch b WHERE b.id = :id")
    Optional<PoultryBatch> findByIdForUpdate(@Param("id") UUID id);
}

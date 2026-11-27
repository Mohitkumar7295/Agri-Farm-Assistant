package com.agrifarm.modules.fisheries.repository;

import com.agrifarm.modules.fisheries.model.PolycultureStock;
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
public interface PolycultureStockRepository extends JpaRepository<PolycultureStock, UUID> {
    List<PolycultureStock> findAllByFishBatchId(UUID fishBatchId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM PolycultureStock s WHERE s.id = :id")
    Optional<PolycultureStock> findByIdForUpdate(@Param("id") UUID id);
}

package com.agrifarm.modules.finance.repository;

import com.agrifarm.modules.finance.model.ExpenseRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<ExpenseRecord, UUID> {
    List<ExpenseRecord> findAllByFarmIdAndUserIdOrderByIncurredOnDesc(UUID farmId, UUID userId);
    List<ExpenseRecord> findAllByUserIdOrderByIncurredOnDesc(UUID userId);
}

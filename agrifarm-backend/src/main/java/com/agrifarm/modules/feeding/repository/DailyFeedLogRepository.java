package com.agrifarm.modules.feeding.repository;

import com.agrifarm.modules.feeding.model.DailyFeedLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DailyFeedLogRepository extends JpaRepository<DailyFeedLog, UUID> {
    List<DailyFeedLog> findAllByEntityIdOrderByLoggedAtDesc(UUID entityId);
}

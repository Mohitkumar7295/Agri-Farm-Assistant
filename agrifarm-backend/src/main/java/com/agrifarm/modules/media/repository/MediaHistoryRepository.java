package com.agrifarm.modules.media.repository;

import com.agrifarm.modules.media.model.MediaHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MediaHistoryRepository extends JpaRepository<MediaHistory, UUID> {
    List<MediaHistory> findAllByUserIdAndEntityTypeAndEntityIdOrderByCreatedAtDesc(
            UUID userId, String entityType, UUID entityId
    );
}

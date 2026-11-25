package com.agrifarm.modules.auth.repository;

import com.agrifarm.modules.auth.model.EmailOtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtpToken, UUID> {
    Optional<EmailOtpToken> findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);
    void deleteAllByEmail(String email);
}

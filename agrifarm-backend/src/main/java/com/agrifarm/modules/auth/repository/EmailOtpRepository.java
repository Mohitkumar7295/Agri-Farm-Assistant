package com.agrifarm.modules.auth.repository;

import com.agrifarm.modules.auth.model.EmailOtpToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailOtpRepository extends MongoRepository<EmailOtpToken, String> {
    Optional<EmailOtpToken> findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);
    void deleteAllByEmail(String email);
}

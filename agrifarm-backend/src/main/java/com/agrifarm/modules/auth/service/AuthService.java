package com.agrifarm.modules.auth.service;

import com.agrifarm.modules.auth.dto.FarmerRegistrationRequest;
import com.agrifarm.modules.auth.model.Role;
import com.agrifarm.modules.auth.model.User;
import com.agrifarm.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public boolean isEmailRegistered(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        return userRepository.existsByEmail(email.toLowerCase().trim());
    }

    public Optional<User> findUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            return Optional.empty();
        }
        return userRepository.findByEmail(email.toLowerCase().trim());
    }

    public Optional<User> findUserById(UUID userId) {
        if (userId == null) {
            return Optional.empty();
        }
        return userRepository.findById(userId);
    }

    public User getUserByEmail(String email) {
        return findUserByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No registered account found with email: " + email));
    }

    @Transactional
    public User markEmailVerified(String email) {
        String cleanEmail = email.toLowerCase().trim();
        User user = findUserByEmail(cleanEmail).orElseGet(() -> User.builder()
                .email(cleanEmail)
                .role(Role.FARMER)
                .preferredLanguage("hi")
                .termsAgreed(false)
                .emailVerified(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());
        user.setEmailVerified(true);
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    @Transactional
    public User registerFarmer(FarmerRegistrationRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();
        log.info("Processing farmer registration for email: {}, lat: {}, lng: {}",
                cleanEmail, request.getLatitude(), request.getLongitude());

        Optional<User> existingUserOpt = userRepository.findByEmail(cleanEmail);
        if (existingUserOpt.isPresent() && Boolean.TRUE.equals(existingUserOpt.get().getEmailVerified())) {
            throw new IllegalStateException("An account with this email address is already registered. Please sign in directly.");
        }

        User user = existingUserOpt.orElseGet(User::new);

        user.setFullName(request.getFullName().trim());
        user.setEmail(cleanEmail);
        user.setMobileNumber(request.getMobileNumber().trim());
        user.setStreetAddress(request.getStreetAddress().trim());
        user.setCountry(request.getCountry().trim());
        user.setState(request.getState().trim());
        user.setDistrict(request.getDistrict().trim());
        user.setVillageOrCity(request.getVillageOrCity().trim());
        user.setPincode(request.getPincode().trim());
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());
        user.setRole(Role.FARMER);
        if (user.getPreferredLanguage() == null) {
            user.setPreferredLanguage("hi");
        }
        user.setTermsAgreed(Boolean.TRUE.equals(request.getTermsAgreed()));
        user.setEmailVerified(false);
        user.setUpdatedAt(Instant.now());

        if (user.getCreatedAt() == null) {
            user.setCreatedAt(Instant.now());
        }

        User savedUser = userRepository.save(user);
        log.info("Farmer registered successfully with ID: {}", savedUser.getId());
        return savedUser;
    }
}

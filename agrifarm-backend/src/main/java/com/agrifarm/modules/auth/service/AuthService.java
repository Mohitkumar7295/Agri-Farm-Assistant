package com.agrifarm.modules.auth.service;

import com.agrifarm.modules.auth.dto.FarmerRegistrationRequest;
import com.agrifarm.modules.auth.model.User;
import com.agrifarm.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

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

    public User getUserByEmail(String email) {
        return findUserByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No registered account found with email: " + email));
    }

    public User markEmailVerified(String email) {
        User user = getUserByEmail(email);
        user.setEmailVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User registerFarmer(FarmerRegistrationRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();
        log.info("Processing farmer registration for email: {}, lat: {}, lng: {}", 
                cleanEmail, request.getLatitude(), request.getLongitude());

        Optional<User> existingUserOpt = userRepository.findByEmail(cleanEmail);
        if (existingUserOpt.isPresent() && Boolean.TRUE.equals(existingUserOpt.get().getEmailVerified())) {
            throw new IllegalStateException("An account with this email address is already registered. Please sign in directly.");
        }

        User user = existingUserOpt.orElse(new User());

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
        user.setRole("FARMER");
        user.setTermsAgreed(Boolean.TRUE.equals(request.getTermsAgreed()));
        user.setEmailVerified(false);
        user.setUpdatedAt(LocalDateTime.now());

        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }

        User savedUser = userRepository.save(user);
        log.info("Farmer registered successfully with ID: {}", savedUser.getId());
        return savedUser;
    }
}

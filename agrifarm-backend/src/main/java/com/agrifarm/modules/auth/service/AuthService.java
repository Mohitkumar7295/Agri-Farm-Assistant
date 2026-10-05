package com.agrifarm.modules.auth.service;

import com.agrifarm.modules.auth.dto.FarmerRegistrationRequest;
import com.agrifarm.modules.auth.model.User;
import com.agrifarm.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public User registerFarmer(FarmerRegistrationRequest request) {
        log.info("Processing farmer registration for email: {}, lat: {}, lng: {}", 
                request.getEmail(), request.getLatitude(), request.getLongitude());

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElse(new User());

        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().toLowerCase().trim());
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
        user.setUpdatedAt(LocalDateTime.now());

        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }

        User savedUser = userRepository.save(user);
        log.info("Farmer registered successfully with ID: {}", savedUser.getId());
        return savedUser;
    }
}

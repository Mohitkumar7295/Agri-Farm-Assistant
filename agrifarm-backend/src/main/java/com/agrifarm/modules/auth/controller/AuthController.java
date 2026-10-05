package com.agrifarm.modules.auth.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.auth.dto.FarmerRegistrationRequest;
import com.agrifarm.modules.auth.model.User;
import com.agrifarm.modules.auth.service.AuthService;
import com.agrifarm.modules.auth.service.EmailOtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailOtpService emailOtpService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody FarmerRegistrationRequest request) {
        log.info("Received farmer registration request for email: {}", request.getEmail());
        User registeredUser = authService.registerFarmer(request);

        // Generate and dispatch OTP via Resend API
        emailOtpService.generateAndSendOtp(request.getEmail());

        return ResponseEntity.ok(ApiResponse.success(
                "Farmer registration recorded and OTP dispatched to " + request.getEmail(),
                registeredUser
        ));
    }

    @PostMapping("/email/send-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email address is required"));
        }

        log.info("Sending OTP via Resend to email: {}", email);
        emailOtpService.generateAndSendOtp(email);

        return ResponseEntity.ok(ApiResponse.success("OTP dispatched successfully", Map.of(
                "email", email.trim(),
                "expiresInSeconds", 600
        )));
    }

    @PostMapping("/email/verify-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email and OTP are required"));
        }

        boolean isValid = emailOtpService.verifyOtp(email, otp);
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired verification code"));
        }

        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", Map.of(
                "email", email.trim(),
                "verified", true,
                "token", "jwt_live_session_" + System.currentTimeMillis()
        )));
    }
}

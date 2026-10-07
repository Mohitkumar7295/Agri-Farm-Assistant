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
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody FarmerRegistrationRequest request) {
        log.info("Received farmer registration request for email: {}", request.getEmail());
        try {
            User registeredUser = authService.registerFarmer(request);

            // Generate and dispatch OTP
            EmailOtpService.OtpDispatchResult otpResult = emailOtpService.generateAndSendOtp(request.getEmail());

            Map<String, Object> responseData = new java.util.HashMap<>();
            responseData.put("user", registeredUser);
            responseData.put("email", registeredUser.getEmail());
            responseData.put("deliveredViaNetwork", otpResult.deliveredViaNetwork());
            responseData.put("channel", otpResult.channel());
            responseData.put("message", otpResult.message());
            if (otpResult.devOtp() != null) {
                responseData.put("devOtp", otpResult.devOtp());
            }

            return ResponseEntity.ok(ApiResponse.success(
                    "Farmer registration recorded and OTP dispatched to " + request.getEmail(),
                    responseData
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to register farmer: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to process registration: " + e.getMessage()));
        }
    }

    @PostMapping("/email/send-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email address is required"));
        }

        String cleanEmail = email.toLowerCase().trim();

        // STRICT MULTI-USER REQUIREMENT: Without registration, no login! First register!
        boolean isRegistered = authService.isEmailRegistered(cleanEmail);
        if (!isRegistered) {
            log.warn("Login rejected for non-registered email: {}", cleanEmail);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(
                    "No account found with email '" + cleanEmail + "'. Please register first to continue."
            ));
        }

        log.info("Sending login OTP to registered email: {}", cleanEmail);
        EmailOtpService.OtpDispatchResult otpResult = emailOtpService.generateAndSendOtp(cleanEmail);

        Map<String, Object> responseData = new java.util.HashMap<>();
        responseData.put("email", cleanEmail);
        responseData.put("expiresInSeconds", 600);
        responseData.put("deliveredViaNetwork", otpResult.deliveredViaNetwork());
        responseData.put("channel", otpResult.channel());
        responseData.put("message", otpResult.message());
        if (otpResult.devOtp() != null) {
            responseData.put("devOtp", otpResult.devOtp());
        }

        return ResponseEntity.ok(ApiResponse.success("OTP dispatched successfully", responseData));
    }

    @PostMapping("/email/verify-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email and OTP are required"));
        }

        String cleanEmail = email.toLowerCase().trim();
        boolean isValid = emailOtpService.verifyOtp(cleanEmail, otp);
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired verification code"));
        }

        // Fetch the REAL registered user from MongoDB and mark verified
        User user = authService.markEmailVerified(cleanEmail);

        String sessionToken = "jwt_live_session_" + System.currentTimeMillis();

        Map<String, Object> responseData = new java.util.HashMap<>();
        responseData.put("email", cleanEmail);
        responseData.put("verified", true);
        responseData.put("token", sessionToken);
        responseData.put("user", user);

        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", responseData));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@RequestParam(required = false) String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email parameter is required"));
        }
        return authService.findUserByEmail(email)
                .map(u -> ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", u)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found")));
    }

    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkEmail(@RequestParam String email) {
        String cleanEmail = email.toLowerCase().trim();
        boolean exists = authService.isEmailRegistered(cleanEmail);
        return ResponseEntity.ok(ApiResponse.success("Email status checked", Map.of(
                "registered", exists,
                "email", cleanEmail
        )));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, Object>>> logout() {
        log.info("User session logged out successfully");
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", Map.of("loggedOut", true)));
    }
}

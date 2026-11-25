package com.agrifarm.modules.auth.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.config.RateLimiterService;
import com.agrifarm.config.TenantContextHolder;
import com.agrifarm.modules.auth.dto.AuthTokenResponse;
import com.agrifarm.modules.auth.dto.FarmerRegistrationRequest;
import com.agrifarm.modules.auth.dto.SendEmailOtpRequest;
import com.agrifarm.modules.auth.dto.VerifyEmailOtpRequest;
import com.agrifarm.modules.auth.model.User;
import com.agrifarm.modules.auth.service.AuthService;
import com.agrifarm.modules.auth.service.EmailOtpService;
import com.agrifarm.modules.auth.service.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailOtpService emailOtpService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RateLimiterService rateLimiterService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody FarmerRegistrationRequest request) {
        log.info("Received farmer registration request for email: {}", request.getEmail());
        User registeredUser = authService.registerFarmer(request);
        EmailOtpService.OtpDispatchResult otpResult = emailOtpService.generateAndSendOtp(request.getEmail());

        Map<String, Object> responseData = new HashMap<>();
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
    }

    @PostMapping("/email/send-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendOtp(
            @Valid @RequestBody SendEmailOtpRequest request,
            HttpServletRequest httpRequest
    ) {
        String cleanEmail = request.getEmail().toLowerCase().trim();
        rateLimiterService.checkOtpRateLimit(cleanEmail, httpRequest.getRemoteAddr());

        // STRICT MULTI-USER REQUIREMENT: Without registration, no login!
        if (!authService.isEmailRegistered(cleanEmail)) {
            log.warn("Login rejected for non-registered email: {}", cleanEmail);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(
                    "No account found with email '" + cleanEmail + "'. Please register first to continue."
            ));
        }

        log.info("Sending login OTP to registered email: {}", cleanEmail);
        EmailOtpService.OtpDispatchResult otpResult = emailOtpService.generateAndSendOtp(cleanEmail);

        Map<String, Object> responseData = new HashMap<>();
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
    public ResponseEntity<ApiResponse<AuthTokenResponse>> verifyOtp(@Valid @RequestBody VerifyEmailOtpRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();
        boolean isValid = emailOtpService.verifyOtp(cleanEmail, request.getOtp());
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired verification code"));
        }

        User user = authService.markEmailVerified(cleanEmail);
        String jwtToken = jwtTokenProvider.generateToken(user);

        AuthTokenResponse responseData = AuthTokenResponse.builder()
                .email(cleanEmail)
                .verified(true)
                .token(jwtToken)
                .tokenType("Bearer")
                .expiresInDays(jwtTokenProvider.getExpirationDays())
                .user(user)
                .build();

        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", responseData));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@RequestParam(required = false) String email) {
        UUID tenantId = TenantContextHolder.getTenantId();
        if (tenantId != null) {
            return authService.findUserById(tenantId)
                    .map(u -> ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", u)))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found")));
        }

        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication token or email parameter is required"));
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

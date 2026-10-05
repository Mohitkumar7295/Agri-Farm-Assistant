package com.agrifarm.modules.auth.service;

import com.agrifarm.modules.auth.model.EmailOtpToken;
import com.agrifarm.modules.auth.repository.EmailOtpRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailOtpService {

    private final EmailOtpRepository emailOtpRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${resend.api.key:${RESEND_API_KEY:}}")
    private String resendApiKey;

    @Value("${resend.from.email:${RESEND_FROM_EMAIL:onboarding@resend.dev}}")
    private String fromEmail;

    private final SecureRandom secureRandom = new SecureRandom();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public String generateAndSendOtp(String email) {
        String cleanEmail = email.toLowerCase().trim();
        int randomCode = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(randomCode);

        // Remove previous tokens for clean state
        emailOtpRepository.deleteAllByEmail(cleanEmail);

        // Store OTP in MongoDB with 10-minute validity
        EmailOtpToken token = EmailOtpToken.builder()
                .email(cleanEmail)
                .otp(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .verified(false)
                .createdAt(LocalDateTime.now())
                .build();
        emailOtpRepository.save(token);
        log.info("Generated OTP for email: {}", cleanEmail);

        // Always print console fallback in development so testing is never blocked
        log.info("🔑 [DEV CONSOLE OTP]: For recipient '{}', OTP is: {}", cleanEmail, otp);

        // Send email via Resend API
        sendEmailViaResend(cleanEmail, otp);

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        String cleanEmail = email.toLowerCase().trim();
        return emailOtpRepository.findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(cleanEmail)
                .map(token -> {
                    if (token.getExpiresAt().isAfter(LocalDateTime.now()) && token.getOtp().equals(otp.trim())) {
                        token.setVerified(true);
                        emailOtpRepository.save(token);
                        log.info("OTP verified successfully for email: {}", cleanEmail);
                        return true;
                    }
                    log.warn("OTP verification mismatch or expired for email: {}", cleanEmail);
                    return false;
                })
                .orElse(false);
    }

    private void sendEmailViaResend(String recipientEmail, String otp) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            log.warn("⚠️ RESEND_API_KEY is not configured. Email not dispatched to network, use console OTP.");
            return;
        }

        try {
            String subject = "AgriFarmAssistant - Your 6-Digit Verification Code";
            String htmlContent = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                    <div style="background: #0F5132; padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">AgriFarmAssistant</h1>
                        <p style="color: #a7f3d0; margin: 4px 0 0; font-size: 13px;">Smart Farm Management Platform</p>
                    </div>
                    <div style="padding: 28px 24px;">
                        <p style="font-size: 15px; color: #1e293b; margin-top: 0;">Hello Farmer,</p>
                        <p style="font-size: 14px; color: #475569; line-height: 1.6;">Use the following 6-digit verification code to complete your AgriFarmAssistant sign-in or registration. This code is valid for <strong>10 minutes</strong>.</p>
                        <div style="margin: 24px 0; text-align: center;">
                            <span style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0F5132; background: #f0fdf4; border: 2px dashed #10b981; border-radius: 12px; padding: 12px 28px;">
                                %s
                            </span>
                        </div>
                        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">If you did not request this OTP, you can safely ignore this email.</p>
                    </div>
                    <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
                        &copy; 2026 AgriFarmAssistant &bull; 256-Bit Encrypted Farmer Gateway
                    </div>
                </div>
            """.formatted(otp);

            Map<String, Object> payload = Map.of(
                    "from", "AgriFarmAssistant <" + fromEmail + ">",
                    "to", List.of(recipientEmail),
                    "subject", subject,
                    "html", htmlContent
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("✅ Resend API email dispatched successfully to: {}", recipientEmail);
            } else if (response.statusCode() == 403) {
                log.warn("⚠️ Resend Free Tier Notice: Under 'onboarding@resend.dev', emails are sent exclusively to your verified account email (e.g. mokumar7295@gmail.com). For testing other emails, check console OTP above.");
            } else {
                log.warn("Resend API returned status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("Failed to send OTP email via Resend: {}", e.getMessage(), e);
        }
    }
}

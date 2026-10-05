package com.agrifarm.modules.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "email_otp_tokens")
public class EmailOtpToken {

    @Id
    private String id;

    @Indexed
    private String email;

    private String otp;

    private LocalDateTime expiresAt;

    private boolean verified;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

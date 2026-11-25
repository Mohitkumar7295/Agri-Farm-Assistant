package com.agrifarm.modules.auth.dto;

import com.agrifarm.modules.auth.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthTokenResponse {
    private String email;
    private boolean verified;
    private String token;
    private String tokenType;
    private long expiresInDays;
    private User user;
}

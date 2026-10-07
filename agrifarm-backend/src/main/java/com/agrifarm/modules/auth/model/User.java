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
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String mobileNumber;

    // Location & Farm Address Fields
    private String streetAddress;
    private String country;
    private String state;
    private String district;
    private String villageOrCity;
    private String pincode;

    // Numeric Double coordinates
    private Double latitude;
    private Double longitude;

    private String role;
    private Boolean termsAgreed;

    @Builder.Default
    private Boolean emailVerified = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}

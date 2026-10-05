package com.agrifarm;

import com.agrifarm.modules.auth.dto.FarmerRegistrationRequest;
import com.agrifarm.modules.auth.model.User;
import com.agrifarm.modules.auth.repository.UserRepository;
import com.agrifarm.modules.auth.service.AuthService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class FarmerRegistrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testFarmerRegistrationWithLocationAndPincode() {
        String testEmail = "test.farmer." + System.currentTimeMillis() + "@agrifarm.org";

        FarmerRegistrationRequest request = FarmerRegistrationRequest.builder()
                .fullName("Ramesh Patel")
                .email(testEmail)
                .mobileNumber("+919876543210")
                .streetAddress("Plot 42, Green Valley Farm Road")
                .country("India")
                .state("Madhya Pradesh")
                .district("Indore")
                .villageOrCity("Sanwer")
                .pincode("452010")
                .latitude(22.9747)
                .longitude(75.8022)
                .termsAgreed(true)
                .build();

        User registeredFarmer = authService.registerFarmer(request);

        Assertions.assertNotNull(registeredFarmer);
        Assertions.assertNotNull(registeredFarmer.getId());
        Assertions.assertEquals(testEmail, registeredFarmer.getEmail());
        Assertions.assertEquals("Plot 42, Green Valley Farm Road", registeredFarmer.getStreetAddress());
        Assertions.assertEquals("India", registeredFarmer.getCountry());
        Assertions.assertEquals("Madhya Pradesh", registeredFarmer.getState());
        Assertions.assertEquals("Indore", registeredFarmer.getDistrict());
        Assertions.assertEquals("Sanwer", registeredFarmer.getVillageOrCity());
        Assertions.assertEquals("452010", registeredFarmer.getPincode());
        Assertions.assertEquals(Double.valueOf(22.9747), registeredFarmer.getLatitude());
        Assertions.assertEquals(Double.valueOf(75.8022), registeredFarmer.getLongitude());
        Assertions.assertTrue(registeredFarmer.getLatitude() instanceof Double);
        Assertions.assertTrue(registeredFarmer.getLongitude() instanceof Double);

        // Verify lookup in repository
        User retrievedUser = userRepository.findById(registeredFarmer.getId()).orElse(null);
        Assertions.assertNotNull(retrievedUser);
        Assertions.assertEquals("452010", retrievedUser.getPincode());
        Assertions.assertEquals(22.9747, retrievedUser.getLatitude());
        Assertions.assertEquals(75.8022, retrievedUser.getLongitude());

        // Cleanup
        userRepository.deleteById(registeredFarmer.getId());
    }
}

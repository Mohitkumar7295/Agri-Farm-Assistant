package com.agrifarm;

import com.agrifarm.modules.auth.controller.AuthController;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class AuthControllerTest {

    @Autowired
    private AuthController authController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private com.agrifarm.modules.auth.repository.UserRepository userRepository;

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void testRegistrationEndpointSuccess() throws Exception {
        String testEmail = "test.clean." + System.currentTimeMillis() + "@agrifarm.org";
        Map<String, Object> payload = new HashMap<>();
        payload.put("fullName", "Test Farmer");
        payload.put("email", testEmail);
        payload.put("mobileNumber", "9876543210");
        payload.put("streetAddress", "Survey No 12, Farm Lane");
        payload.put("country", "India");
        payload.put("state", "Madhya Pradesh");
        payload.put("district", "Indore");
        payload.put("villageOrCity", "Sanwer");
        payload.put("pincode", "452010");
        payload.put("latitude", 22.9747);
        payload.put("longitude", 75.8022);
        payload.put("termsAgreed", true);

        try {
            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(payload)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.user.streetAddress").value("Survey No 12, Farm Lane"))
                    .andExpect(jsonPath("$.data.user.pincode").value("452010"))
                    .andExpect(jsonPath("$.data.user.latitude").value(22.9747))
                    .andExpect(jsonPath("$.data.user.longitude").value(75.8022));
        } finally {
            userRepository.findByEmail(testEmail).ifPresent(u -> userRepository.deleteById(u.getId()));
        }
    }

    @Test
    void testRegistrationEndpointInvalidPincode() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("fullName", "Ramesh Patel");
        payload.put("email", "ramesh.invalid@gmail.com");
        payload.put("mobileNumber", "9876543210");
        payload.put("streetAddress", "Plot 42, Green Valley Farm Road");
        payload.put("country", "India");
        payload.put("state", "Madhya Pradesh");
        payload.put("district", "Indore");
        payload.put("villageOrCity", "Sanwer");
        payload.put("pincode", "45201"); // Invalid: only 5 digits
        payload.put("latitude", 22.9747);
        payload.put("longitude", 75.8022);
        payload.put("termsAgreed", true);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest());
    }
}

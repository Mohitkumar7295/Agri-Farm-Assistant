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

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void testRegistrationEndpointSuccess() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("fullName", "Ramesh Patel");
        payload.put("email", "ramesh.patel." + System.currentTimeMillis() + "@gmail.com");
        payload.put("mobileNumber", "9876543210");
        payload.put("streetAddress", "Plot 42, Green Valley Farm Road");
        payload.put("country", "India");
        payload.put("state", "Madhya Pradesh");
        payload.put("district", "Indore");
        payload.put("villageOrCity", "Sanwer");
        payload.put("pincode", "452010");
        payload.put("latitude", 22.9747);
        payload.put("longitude", 75.8022);
        payload.put("termsAgreed", true);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.streetAddress").value("Plot 42, Green Valley Farm Road"))
                .andExpect(jsonPath("$.data.pincode").value("452010"))
                .andExpect(jsonPath("$.data.latitude").value(22.9747))
                .andExpect(jsonPath("$.data.longitude").value(75.8022));
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

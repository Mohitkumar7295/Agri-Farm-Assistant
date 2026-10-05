package com.agrifarm;

import com.agrifarm.modules.weather.controller.WeatherController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class WeatherControllerTest {

    @Autowired
    private WeatherController weatherController;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(weatherController).build();
    }

    @Test
    void testGetWeatherSuccess() throws Exception {
        mockMvc.perform(get("/api/weather")
                        .param("latitude", "25.5941")
                        .param("longitude", "85.1376")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latitude").value(25.5941))
                .andExpect(jsonPath("$.longitude").value(85.1376))
                .andExpect(jsonPath("$.temperature").isNumber())
                .andExpect(jsonPath("$.humidity").isNumber())
                .andExpect(jsonPath("$.windSpeed").isNumber())
                .andExpect(jsonPath("$.weatherCode").isNumber())
                .andExpect(jsonPath("$.weatherCondition").isString())
                .andExpect(jsonPath("$.maxTemperature").isNumber())
                .andExpect(jsonPath("$.minTemperature").isNumber());
    }

    @Test
    void testGetWeatherMissingCoordinates() throws Exception {
        mockMvc.perform(get("/api/weather")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("MISSING_COORDINATES"));
    }
}

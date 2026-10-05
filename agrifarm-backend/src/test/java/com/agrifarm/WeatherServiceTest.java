package com.agrifarm;

import com.agrifarm.modules.weather.dto.WeatherResponse;
import com.agrifarm.modules.weather.service.WeatherService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class WeatherServiceTest {

    @Autowired
    private WeatherService weatherService;

    @Test
    void testGetFarmWeatherFromOpenMeteo() {
        // Farm coordinates in Patna, Bihar (from prompt example: 25.5941, 85.1376)
        Double latitude = 25.5941;
        Double longitude = 85.1376;

        WeatherResponse weather = weatherService.getFarmWeather(latitude, longitude);

        Assertions.assertNotNull(weather);
        Assertions.assertEquals(latitude, weather.getLatitude());
        Assertions.assertEquals(longitude, weather.getLongitude());
        Assertions.assertNotNull(weather.getTemperature(), "Temperature should not be null");
        Assertions.assertNotNull(weather.getHumidity(), "Humidity should not be null");
        Assertions.assertNotNull(weather.getWindSpeed(), "Wind speed should not be null");
        Assertions.assertNotNull(weather.getWeatherCode(), "Weather code should not be null");
        Assertions.assertNotNull(weather.getWeatherCondition(), "Weather condition should not be null");
        Assertions.assertFalse(weather.getWeatherCondition().isBlank());
        Assertions.assertNotNull(weather.getMaxTemperature(), "Max temperature should not be null");
        Assertions.assertNotNull(weather.getMinTemperature(), "Min temperature should not be null");
        Assertions.assertNotNull(weather.getPrecipitation(), "Precipitation should not be null");
    }

    @Test
    void testWeatherCodeDescriptionMapping() {
        Assertions.assertEquals("Clear sky", WeatherService.getWeatherDescription(0));
        Assertions.assertEquals("Mainly clear", WeatherService.getWeatherDescription(1));
        Assertions.assertEquals("Partly cloudy", WeatherService.getWeatherDescription(2));
        Assertions.assertEquals("Overcast", WeatherService.getWeatherDescription(3));
        Assertions.assertEquals("Fog", WeatherService.getWeatherDescription(45));
        Assertions.assertEquals("Slight rain", WeatherService.getWeatherDescription(61));
        Assertions.assertEquals("Thunderstorm", WeatherService.getWeatherDescription(95));
    }
}

package com.agrifarm.modules.weather.service;

import com.agrifarm.modules.weather.dto.WeatherResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class WeatherService {

    private static final long CACHE_TTL_SECONDS = 1800; // 30 minutes
    private static final String REDIS_KEY_PREFIX = "weather:openmeteo:";

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final ObjectProvider<StringRedisTemplate> redisTemplateProvider;
    private final String redisUrl;
    private final Map<String, CacheEntry> inMemoryCache = new ConcurrentHashMap<>();

    private record CacheEntry(WeatherResponse data, Instant cachedAt) {}

    @Autowired
    public WeatherService(
            ObjectProvider<StringRedisTemplate> redisTemplateProvider,
            @Value("${app.redis.url:}") String redisUrl
    ) {
        this.redisTemplateProvider = redisTemplateProvider;
        this.redisUrl = redisUrl;
        this.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(8))
                .build();
    }

    public WeatherResponse getFarmWeather(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("Latitude and longitude must not be null");
        }

        String cacheKey = String.format("%.3f_%.3f", latitude, longitude);
        WeatherResponse cached = readFromCache(cacheKey);
        if (cached != null) {
            log.info("Returning cached farm weather for [lat: {}, lng: {}]", latitude, longitude);
            return cached;
        }

        try {
            String url = String.format(
                    "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f" +
                            "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,cloud_cover" +
                            "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum" +
                            "&timezone=auto",
                    latitude, longitude
            );

            log.info("Fetching farm weather from Open-Meteo: {}", url);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(10))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("Open-Meteo returned status code: {} - {}", response.statusCode(), response.body());
                WeatherResponse stale = readStaleInMemory(cacheKey);
                if (stale != null) {
                    return stale;
                }
                throw new RuntimeException("Open-Meteo service returned HTTP " + response.statusCode());
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode current = root.path("current");
            JsonNode daily = root.path("daily");

            Double temperature = current.has("temperature_2m") ? current.get("temperature_2m").asDouble() : null;
            Integer humidity = current.has("relative_humidity_2m") ? current.get("relative_humidity_2m").asInt() : null;
            Double windSpeed = current.has("wind_speed_10m") ? current.get("wind_speed_10m").asDouble() : null;
            Integer weatherCode = current.has("weather_code") ? current.get("weather_code").asInt() : 0;
            Integer cloudCover = current.has("cloud_cover") ? current.get("cloud_cover").asInt() : 0;

            Double maxTemp = daily.path("temperature_2m_max").isArray() && !daily.path("temperature_2m_max").isEmpty()
                    ? daily.path("temperature_2m_max").get(0).asDouble() : null;
            Double minTemp = daily.path("temperature_2m_min").isArray() && !daily.path("temperature_2m_min").isEmpty()
                    ? daily.path("temperature_2m_min").get(0).asDouble() : null;
            Double precipitation = daily.path("precipitation_sum").isArray() && !daily.path("precipitation_sum").isEmpty()
                    ? daily.path("precipitation_sum").get(0).asDouble() : 0.0;

            WeatherResponse weatherResponse = WeatherResponse.builder()
                    .latitude(latitude)
                    .longitude(longitude)
                    .temperature(temperature)
                    .humidity(humidity)
                    .windSpeed(windSpeed)
                    .weatherCode(weatherCode)
                    .weatherCondition(getWeatherDescription(weatherCode))
                    .maxTemperature(maxTemp)
                    .minTemperature(minTemp)
                    .precipitation(precipitation)
                    .cloudCover(cloudCover)
                    .timestamp(LocalDateTime.now())
                    .build();

            writeToCache(cacheKey, weatherResponse);
            return weatherResponse;

        } catch (Exception ex) {
            log.error("Error communicating with Open-Meteo API: {}", ex.getMessage(), ex);
            WeatherResponse stale = readStaleInMemory(cacheKey);
            if (stale != null) {
                log.warn("Recovering with previously cached weather data due to error: {}", ex.getMessage());
                return stale;
            }
            throw new RuntimeException("Unable to retrieve farm weather from Open-Meteo: " + ex.getMessage(), ex);
        }
    }

    private WeatherResponse readFromCache(String cacheKey) {
        if (isRedisConfigured()) {
            StringRedisTemplate redis = redisTemplateProvider != null ? redisTemplateProvider.getIfAvailable() : null;
            if (redis != null) {
                try {
                    String json = redis.opsForValue().get(REDIS_KEY_PREFIX + cacheKey);
                    if (json != null && !json.isBlank()) {
                        return objectMapper.readValue(json, WeatherResponse.class);
                    }
                } catch (Exception ex) {
                    log.debug("Redis weather read unavailable, using in-memory cache: {}", ex.getMessage());
                }
            }
        }
        CacheEntry entry = inMemoryCache.get(cacheKey);
        if (entry != null && Instant.now().minusSeconds(CACHE_TTL_SECONDS).isBefore(entry.cachedAt())) {
            return entry.data();
        }
        return null;
    }

    private WeatherResponse readStaleInMemory(String cacheKey) {
        CacheEntry entry = inMemoryCache.get(cacheKey);
        return entry != null ? entry.data() : null;
    }

    private void writeToCache(String cacheKey, WeatherResponse weatherResponse) {
        inMemoryCache.put(cacheKey, new CacheEntry(weatherResponse, Instant.now()));
        if (isRedisConfigured()) {
            StringRedisTemplate redis = redisTemplateProvider != null ? redisTemplateProvider.getIfAvailable() : null;
            if (redis != null) {
                try {
                    String json = objectMapper.writeValueAsString(weatherResponse);
                    redis.opsForValue().set(REDIS_KEY_PREFIX + cacheKey, json, Duration.ofSeconds(CACHE_TTL_SECONDS));
                } catch (Exception ex) {
                    log.debug("Redis weather write unavailable, kept in-memory cache: {}", ex.getMessage());
                }
            }
        }
    }

    private boolean isRedisConfigured() {
        return redisUrl != null && !redisUrl.isBlank() && !redisUrl.contains("<password>");
    }

    public static String getWeatherDescription(int code) {
        return switch (code) {
            case 0 -> "Clear sky";
            case 1 -> "Mainly clear";
            case 2 -> "Partly cloudy";
            case 3 -> "Overcast";
            case 45 -> "Fog";
            case 48 -> "Depositing rime fog";
            case 51 -> "Light drizzle";
            case 53 -> "Moderate drizzle";
            case 55 -> "Dense drizzle";
            case 56, 57 -> "Freezing drizzle";
            case 61 -> "Slight rain";
            case 63 -> "Moderate rain";
            case 65 -> "Heavy rain";
            case 66, 67 -> "Freezing rain";
            case 71 -> "Slight snow fall";
            case 73 -> "Moderate snow fall";
            case 75 -> "Heavy snow fall";
            case 77 -> "Snow grains";
            case 80 -> "Slight rain showers";
            case 81 -> "Moderate rain showers";
            case 82 -> "Violent rain showers";
            case 85, 86 -> "Snow showers";
            case 95 -> "Thunderstorm";
            case 96, 99 -> "Thunderstorm with hail";
            default -> "Partly cloudy";
        };
    }
}

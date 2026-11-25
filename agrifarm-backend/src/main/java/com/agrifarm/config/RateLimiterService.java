package com.agrifarm.config;

import com.agrifarm.common.exception.RateLimitExceededException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Sliding-window rate limiter backed by Upstash Redis when configured,
 * with a thread-safe in-memory fallback for local development without Redis.
 */
@Slf4j
@Service
public class RateLimiterService {

    private final ObjectProvider<StringRedisTemplate> redisTemplateProvider;
    private final String redisUrl;
    private final int maxOtpRequests;
    private final long windowMinutes;
    private final Map<String, Deque<Instant>> inMemoryWindows = new ConcurrentHashMap<>();

    public RateLimiterService(
            ObjectProvider<StringRedisTemplate> redisTemplateProvider,
            @Value("${app.redis.url:}") String redisUrl,
            @Value("${app.rate-limit.otp.max-requests:3}") int maxOtpRequests,
            @Value("${app.rate-limit.otp.window-minutes:10}") long windowMinutes
    ) {
        this.redisTemplateProvider = redisTemplateProvider;
        this.redisUrl = redisUrl;
        this.maxOtpRequests = maxOtpRequests;
        this.windowMinutes = windowMinutes;
    }

    public void checkOtpRateLimit(String email, String clientIp) {
        String key = "rl:otp:" + email + ":" + (clientIp != null ? clientIp : "unknown");
        if (redisUrl != null && !redisUrl.isBlank()) {
            StringRedisTemplate redisTemplate = redisTemplateProvider.getIfAvailable();
            if (redisTemplate != null) {
                try {
                    checkWithRedis(redisTemplate, key);
                    return;
                } catch (RateLimitExceededException ex) {
                    throw ex;
                } catch (Exception ex) {
                    log.warn("Redis rate limiter unavailable, falling back to in-memory: {}", ex.getMessage());
                }
            }
        }
        checkInMemory(key);
    }

    private void checkWithRedis(StringRedisTemplate redisTemplate, String key) {
        long nowMs = Instant.now().toEpochMilli();
        long windowStartMs = nowMs - Duration.ofMinutes(windowMinutes).toMillis();

        redisTemplate.opsForZSet().removeRangeByScore(key, 0, windowStartMs);
        Long count = redisTemplate.opsForZSet().zCard(key);
        if (count != null && count >= maxOtpRequests) {
            throw new RateLimitExceededException(
                    "Too many OTP requests. Please wait " + windowMinutes + " minutes before trying again."
            );
        }
        redisTemplate.opsForZSet().add(key, String.valueOf(nowMs), nowMs);
        redisTemplate.expire(key, Duration.ofMinutes(windowMinutes));
    }

    private void checkInMemory(String key) {
        Instant now = Instant.now();
        Instant cutoff = now.minus(Duration.ofMinutes(windowMinutes));
        Deque<Instant> window = inMemoryWindows.computeIfAbsent(key, k -> new ArrayDeque<>());

        synchronized (window) {
            while (!window.isEmpty() && window.peekFirst().isBefore(cutoff)) {
                window.pollFirst();
            }
            if (window.size() >= maxOtpRequests) {
                throw new RateLimitExceededException(
                        "Too many OTP requests. Please wait " + windowMinutes + " minutes before trying again."
                );
            }
            window.addLast(now);
        }
    }
}

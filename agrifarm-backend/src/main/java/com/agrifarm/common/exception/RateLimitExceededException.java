package com.agrifarm.common.exception;

/**
 * Thrown when a client exceeds the sliding-window rate limit.
 */
public class RateLimitExceededException extends RuntimeException {
    public RateLimitExceededException(String message) {
        super(message);
    }
}

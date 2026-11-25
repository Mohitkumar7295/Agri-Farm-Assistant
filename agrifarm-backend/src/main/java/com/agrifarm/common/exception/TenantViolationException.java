package com.agrifarm.common.exception;

/**
 * Thrown when a tenant attempts to access or mutate a resource belonging to another user.
 */
public class TenantViolationException extends RuntimeException {
    public TenantViolationException(String message) {
        super(message);
    }
}

package com.agrifarm.common.exception;

/**
 * Thrown when a mortality decrement would cause biological stock to go negative.
 */
public class StockUnderflowException extends RuntimeException {
    public StockUnderflowException(String message) {
        super(message);
    }
}

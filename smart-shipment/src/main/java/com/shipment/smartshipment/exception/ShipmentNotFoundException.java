package com.shipment.smartshipment.exception;

public class ShipmentNotFoundException extends RuntimeException{
    public ShipmentNotFoundException(String message){
        super(message);
    }
}

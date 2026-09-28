package com.shipment.smartshipment.entity;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Current lifecycle status of a shipment", example = "IN_TRANSIT")
public enum ShipmentStatus {
    CREATED,
    IN_TRANSIT,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED

}

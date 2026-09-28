package com.shipment.smartshipment.dto;

import com.shipment.smartshipment.entity.ShipmentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Schema(description = "Shipment details returned by the API")
public class ShipmentResponse {

    @Schema(description = "Database identifier of the shipment", example = "1")
    private Long id;
    @Schema(description = "Unique tracking number", example = "TRK1001")
    private String trackingNumber;
    @Schema(description = "Name of the sender", example = "Yash")
    private String senderName;
    @Schema(description = "Name of the receiver", example = "Rahul")
    private String receiverName;
    @Schema(description = "Shipment origin", example = "Delhi")
    private String origin;
    @Schema(description = "Shipment destination", example = "Mumbai")
    private String destination;
    @Schema(description = "Current shipment status", example = "IN_TRANSIT")
    private ShipmentStatus status;
    @Schema(description = "Time at which the shipment was created", example = "2026-09-18T10:30:00")
    private LocalDateTime createdAt;
}

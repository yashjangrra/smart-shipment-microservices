package com.shipment.smartshipment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Request payload used to create or update a shipment")
public class ShipmentRequest {

    @NotBlank(message = "Tracking number is required")
    @Schema(
            description = "Unique tracking number assigned to the shipment",
            example = "TRK1001"
    )
    private String trackingNumber;

    @NotBlank(message = "Sender name is required")
    @Schema(
            description = "Name of the shipment sender",
            example = "Yash"
    )
    private String senderName;

    @NotBlank(message = "Receiver name is required")
    @Schema(
            description = "Name of the shipment receiver",
            example = "Rahul"
    )
    private String receiverName;

    @NotBlank(message = "Origin is required")
    @Schema(
            description = "Shipment origin location",
            example = "Delhi"
    )
    private String origin;

    @NotBlank(message = "Destination is required")
    @Schema(
            description = "Shipment destination location",
            example = "Mumbai"
    )
    private String destination;
}
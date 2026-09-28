package com.shipment.smartshipment.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@Schema(description = "Notification associated with a shipment")
public class NotificationResponse {

    @Schema(description = "Notification identifier", example = "1")
    private Long id;
    @Schema(description = "Identifier of the related shipment", example = "1")
    private Long shipmentId;
    @Schema(description = "Notification recipient", example = "rahul@example.com")
    private String recipient;
    @Schema(description = "Notification content", example = "Shipment TRK1001 is in transit.")
    private String message;
    @Schema(description = "Time at which the notification was created", example = "2026-09-18T10:30:00")
    private LocalDateTime createdAt;
}

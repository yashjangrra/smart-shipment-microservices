package com.shipment.smartshipment.entity;

import jakarta.persistence.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shipment_tracking_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "A record of a shipment status change")
public class ShipmentTrackingHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Tracking-history identifier", example = "1")
    private Long id;
    @Schema(description = "Identifier of the related shipment", example = "1")
    private Long shipmentId;
    @Enumerated(EnumType.STRING)
    @Schema(description = "Shipment status before the change", example = "CREATED")
    private ShipmentStatus oldStatus;
    @Enumerated(EnumType.STRING)
    @Schema(description = "Shipment status after the change", example = "IN_TRANSIT")
    private ShipmentStatus newStatus;
    @Schema(description = "Time at which the status changed", example = "2026-09-18T10:30:00")
    private LocalDateTime changedAt;
    @PrePersist
    protected void onCreate() {
        changedAt = LocalDateTime.now();
    }
}

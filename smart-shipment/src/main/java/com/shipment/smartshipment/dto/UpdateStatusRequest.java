package com.shipment.smartshipment.dto;


import com.shipment.smartshipment.entity.ShipmentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Request payload used to update a shipment status")
public class UpdateStatusRequest {
    @Schema(description = "New status for the shipment", example = "IN_TRANSIT")
    private ShipmentStatus status ;
}

package com.shipment.smartshipment.controller;

import com.shipment.smartshipment.ShipmentTrackingHistoryService;
import com.shipment.smartshipment.entity.ShipmentTrackingHistory;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
@Tag(name = "Shipment Tracking History", description = "APIs for viewing shipment status history")
public class ShipmentTrackingHistoryController {

    private final ShipmentTrackingHistoryService trackingHistoryService;
    @GetMapping("/{shipmentId}/history")
    @Operation(summary = "Get shipment status history", description = "Retrieves every recorded status transition for a shipment")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tracking history retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Shipment not found")
    })
    public List<ShipmentTrackingHistory> getHistory(
            @Parameter(description = "Unique ID of the shipment", example = "1")
            @PathVariable Long shipmentId) {

        return trackingHistoryService.getHistoryByShipmentId(shipmentId);
    }
}

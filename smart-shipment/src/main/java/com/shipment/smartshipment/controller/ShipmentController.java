package com.shipment.smartshipment.controller;

import com.shipment.smartshipment.ShipmentService;
import com.shipment.smartshipment.dto.NotificationResponse;
import com.shipment.smartshipment.dto.ShipmentRequest;
import com.shipment.smartshipment.dto.ShipmentResponse;
import com.shipment.smartshipment.dto.UpdateStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(
        name = "Shipment Controller",
        description = "APIs for managing shipments"
)
public class ShipmentController {

    private final ShipmentService shipmentService;


    // ==================== CREATE SHIPMENT ====================

    @PostMapping("/shipments")
    @Operation(
            summary = "Create a new shipment",
            description = "Creates a new shipment and stores it in the database"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Shipment created successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid shipment request"
            )
    })
    public ShipmentResponse createShipment(
            @Valid @RequestBody ShipmentRequest request) {

        return shipmentService.createShipment(request);
    }


    // ==================== GET SHIPMENT BY ID ====================

    @GetMapping("/shipments/{id}")
    @Operation(
            summary = "Get shipment by ID",
            description = "Retrieves complete shipment details using shipment ID"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Shipment found successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Shipment not found"
            )
    })
    public ShipmentResponse getShipmentById(
            @Parameter(
                    description = "Unique ID of the shipment",
                    example = "1"
            )
            @PathVariable Long id) {

        return shipmentService.getShipmentById(id);
    }


    // ==================== GET ALL SHIPMENTS ====================

    @GetMapping("/shipments")
    @Operation(
            summary = "Get all shipments",
            description = "Retrieves a list of all shipments"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Shipments retrieved successfully"
            )
    })
    public List<ShipmentResponse> getAllShipments() {

        return shipmentService.getAllShipments();
    }


    // ==================== GET NOTIFICATIONS ====================

    @GetMapping("/shipments/{id}/notifications")
    @Operation(
            summary = "Get shipment notifications",
            description = "Retrieves all notifications associated with a shipment"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Notifications retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Shipment not found"
            )
    })
    public List<NotificationResponse> getShipmentNotifications(
            @Parameter(
                    description = "Unique ID of the shipment",
                    example = "1"
            )
            @PathVariable Long id) {

        return shipmentService.getShipmentNotifications(id);
    }


    // ==================== DELETE SHIPMENT ====================

    @DeleteMapping("/shipments/{id}")
    @Operation(
            summary = "Delete shipment",
            description = "Deletes a shipment using its ID"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Shipment deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Shipment not found"
            )
    })
    public String deleteShipment(
            @Parameter(
                    description = "Unique ID of the shipment",
                    example = "1"
            )
            @PathVariable Long id) {

        shipmentService.deleteShipment(id);

        return "Shipment deleted successfully";
    }


    // ==================== UPDATE SHIPMENT ====================

    @PutMapping("/shipments/{id}")
    @Operation(
            summary = "Update shipment",
            description = "Updates the details of an existing shipment"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Shipment updated successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid shipment request"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Shipment not found"
            )
    })
    public ShipmentResponse updateShipment(
            @Parameter(
                    description = "Unique ID of the shipment",
                    example = "1"
            )
            @PathVariable Long id,
            @Valid @RequestBody ShipmentRequest request) {

        return shipmentService.updateShipment(id, request);
    }


    // ==================== UPDATE SHIPMENT STATUS ====================

    @PatchMapping("/shipments/{id}/status")
    @Operation(
            summary = "Update shipment status",
            description = "Updates the current status of a shipment"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Shipment status updated successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Shipment not found"
            )
    })
    public ShipmentResponse updateShipmentStatus(
            @Parameter(
                    description = "Unique ID of the shipment",
                    example = "1"
               )
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {

        return shipmentService.updateShipmentStatus(id, request.getStatus());
    }
}
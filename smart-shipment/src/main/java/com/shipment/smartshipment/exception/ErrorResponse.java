package com.shipment.smartshipment.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import io.swagger.v3.oas.annotations.media.Schema;
@Getter
@AllArgsConstructor
@Schema(description = "Standard error response returned by the API")
public class ErrorResponse {
    @Schema(description = "HTTP status code", example = "404")
    private int status;
    @Schema(description = "Short error title", example = "Not Found")
    private String message;
    @Schema(description = "Detailed explanation of the error", example = "Shipment not found with id: 1")
    private String error;
    @Schema(description = "Request path that produced the error", example = "/shipments/1")
    private String path;
}

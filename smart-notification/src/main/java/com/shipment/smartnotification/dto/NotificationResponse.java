package com.shipment.smartnotification.dto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {

    private Long id;
    private Long shipmentId;
    private String recipient;
    private String message;
    private LocalDateTime createdAt;
}
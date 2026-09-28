package com.shipment.smartshipment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.shipment.smartshipment.dto.NotificationResponse;

import java.util.List;

@FeignClient(name = "SMART-NOTIFICATION")
public interface NotificationClient {

    @GetMapping("/api/notifications/shipment/{shipmentId}")
    List<NotificationResponse> getNotificationsByShipmentId(
            @PathVariable("shipmentId") Long shipmentId);
}

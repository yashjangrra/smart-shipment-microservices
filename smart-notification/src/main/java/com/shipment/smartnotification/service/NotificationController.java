package com.shipment.smartnotification.service;

import com.shipment.smartnotification.entity.Notification;
import com.shipment.smartnotification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }
    @GetMapping("/{id}")
    public Notification getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }
    @GetMapping("/shipment/{shipmentId}")
    public List<Notification> getNotificationsByShipmentId(
            @PathVariable Long shipmentId) {
        return notificationService.getNotificationsByShipmentId(shipmentId);
    }
}
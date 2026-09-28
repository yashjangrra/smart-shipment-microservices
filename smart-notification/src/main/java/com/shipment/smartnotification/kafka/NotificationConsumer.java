package com.shipment.smartnotification.kafka;

import com.shipment.smartnotification.entity.Notification;
import com.shipment.smartnotification.service.NotificationService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumer {

    private final NotificationService notificationService;

    public NotificationConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(
            topics = "shipment-notifications",
            groupId = "notification-service"
    )
    public void consume(String message) {

        System.out.println("📩 Notification received: " + message);

        Notification notification = new Notification();
        notification.setMessage(message);

        notificationService.saveNotification(notification);
    }
}
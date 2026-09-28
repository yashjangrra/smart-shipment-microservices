package com.shipment.smartnotification.service;

import com.shipment.smartnotification.entity.Notification;
import com.shipment.smartnotification.exception.NotificationNotFoundException;
import com.shipment.smartnotification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification saveNotification(Notification notification){
        return notificationRepository.save(notification);
    }
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() ->
                        new NotificationNotFoundException(
                                "Notification not found with id: " + id
                        )
                );

        }
    public List<Notification> getNotificationsByShipmentId(Long shipmentId) {
        return notificationRepository.findByShipmentId(shipmentId);
    }
    }

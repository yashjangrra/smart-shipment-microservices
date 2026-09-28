package com.shipment.smartnotification.repository;

import com.shipment.smartnotification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {
    List<Notification> findByShipmentId(Long shipmentId);

}
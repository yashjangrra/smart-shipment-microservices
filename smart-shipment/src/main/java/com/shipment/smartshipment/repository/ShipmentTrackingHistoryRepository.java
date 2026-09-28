package com.shipment.smartshipment.repository;

import com.shipment.smartshipment.entity.ShipmentTrackingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShipmentTrackingHistoryRepository
        extends JpaRepository<ShipmentTrackingHistory, Long> {

    List<ShipmentTrackingHistory> findByShipmentIdOrderByChangedAtAsc(Long shipmentId);


}


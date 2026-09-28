package com.shipment.smartshipment;

import com.shipment.smartshipment.entity.ShipmentTrackingHistory;
import com.shipment.smartshipment.repository.ShipmentTrackingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;



@Service
@RequiredArgsConstructor
public class ShipmentTrackingHistoryService {

    private final ShipmentTrackingHistoryRepository trackingHistoryRepository;

    public ShipmentTrackingHistory saveHistory(ShipmentTrackingHistory history) {
        return trackingHistoryRepository.save(history);

    }
    public List<ShipmentTrackingHistory> getHistoryByShipmentId(Long shipmentId) {
        return trackingHistoryRepository
                .findByShipmentIdOrderByChangedAtAsc(shipmentId);
    }
}
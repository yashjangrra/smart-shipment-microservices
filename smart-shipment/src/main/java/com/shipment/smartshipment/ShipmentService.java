package com.shipment.smartshipment;

import com.shipment.smartshipment.client.NotificationClient;
import com.shipment.smartshipment.dto.NotificationResponse;
import com.shipment.smartshipment.dto.ShipmentRequest;
import com.shipment.smartshipment.dto.ShipmentResponse;
import com.shipment.smartshipment.entity.Shipment;
import com.shipment.smartshipment.entity.ShipmentStatus;
import com.shipment.smartshipment.entity.ShipmentTrackingHistory;
import com.shipment.smartshipment.kafka.ShipmentKafkaProducer;
import com.shipment.smartshipment.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.shipment.smartshipment.exception.ShipmentNotFoundException;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;


import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShipmentService {
    private final ShipmentRepository shipmentRepository;
    private final ShipmentKafkaProducer shipmentKafkaProducer;
    private final ShipmentTrackingHistoryService trackingHistoryService;
    private final NotificationClient notificationClient;
    private final CircuitBreakerFactory circuitBreakerFactory;

    public ShipmentResponse createShipment(ShipmentRequest request) {

        Shipment shipment = new Shipment();

        shipment.setTrackingNumber(request.getTrackingNumber());
        shipment.setSenderName(request.getSenderName());
        shipment.setReceiverName(request.getReceiverName());
        shipment.setOrigin(request.getOrigin());
        shipment.setDestination(request.getDestination());

        shipment.setStatus(ShipmentStatus.CREATED);

        Shipment savedShipment = shipmentRepository.save(shipment);

        return new ShipmentResponse(
                savedShipment.getId(),
                savedShipment.getTrackingNumber(),
                savedShipment.getSenderName(),
                savedShipment.getReceiverName(),
                savedShipment.getOrigin(),
                savedShipment.getDestination(),
                savedShipment.getStatus(),
                savedShipment.getCreatedAt()
        );
    }

    public ShipmentResponse getShipmentById(Long id) {

        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() ->
                        new ShipmentNotFoundException(
                                "Shipment not found with id: " + id
                        ));

        return new ShipmentResponse(
                shipment.getId(),
                shipment.getTrackingNumber(),
                shipment.getSenderName(),
                shipment.getReceiverName(),
                shipment.getOrigin(),
                shipment.getDestination(),
                shipment.getStatus(),
                shipment.getCreatedAt()
        );
    }

    public List<ShipmentResponse> getAllShipments() {

        return shipmentRepository.findAll()
                .stream()
                .map(shipment -> new ShipmentResponse(
                        shipment.getId(),
                        shipment.getTrackingNumber(),
                        shipment.getSenderName(),
                        shipment.getReceiverName(),
                        shipment.getOrigin(),
                        shipment.getDestination(),
                        shipment.getStatus(),
                        shipment.getCreatedAt()
                ))
                .toList();
    }

    public void deleteShipment(Long id) {

        if (!shipmentRepository.existsById(id)) {
            throw new ShipmentNotFoundException("Shipment not found with id :" + id);
        }

        shipmentRepository.deleteById(id);
    }

    public ShipmentResponse updateShipment(Long id, ShipmentRequest request) {

        Shipment existingShipment = shipmentRepository.findById(id)
                .orElseThrow(() ->
                        new ShipmentNotFoundException(
                                "Shipment not found with id: " + id));

        existingShipment.setTrackingNumber(request.getTrackingNumber());
        existingShipment.setSenderName(request.getSenderName());
        existingShipment.setReceiverName(request.getReceiverName());
        existingShipment.setOrigin(request.getOrigin());
        existingShipment.setDestination(request.getDestination());

        Shipment savedShipment = shipmentRepository.save(existingShipment);

        return new ShipmentResponse(
                savedShipment.getId(),
                savedShipment.getTrackingNumber(),
                savedShipment.getSenderName(),
                savedShipment.getReceiverName(),
                savedShipment.getOrigin(),
                savedShipment.getDestination(),
                savedShipment.getStatus(),
                savedShipment.getCreatedAt()
        );
    }

    public ShipmentResponse updateShipmentStatus(Long id, ShipmentStatus newStatus){

        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() ->
                        new ShipmentNotFoundException("Shipment not found with id : " + id));

        ShipmentStatus currentStatus = shipment.getStatus();
        if (!isValidTransition(currentStatus, newStatus)) {
            throw new IllegalStateException(
                    "Invalid status transition from "
                            + currentStatus + " to " + newStatus);
        }


        shipment.setStatus(newStatus);

        Shipment savedShipment = shipmentRepository.save(shipment);
        ShipmentTrackingHistory history = ShipmentTrackingHistory.builder()
                .shipmentId(savedShipment.getId())
                .oldStatus(currentStatus)
                .newStatus(newStatus)
                .build();

        trackingHistoryService.saveHistory(history);


        String message = "Shipment " + savedShipment.getTrackingNumber()
                + " status changed from " + currentStatus
                + " to " + newStatus;

        shipmentKafkaProducer.sendNotification(message);

        return new ShipmentResponse(
                savedShipment.getId(),
                savedShipment.getTrackingNumber(),
                savedShipment.getSenderName(),
                savedShipment.getReceiverName(),
                savedShipment.getOrigin(),
                savedShipment.getDestination(),
                savedShipment.getStatus(),
                savedShipment.getCreatedAt()
        );
    }

    private boolean isValidTransition(
            ShipmentStatus currentStatus,
            ShipmentStatus newStatus) {

        return switch (currentStatus) {

            case CREATED -> newStatus == ShipmentStatus.IN_TRANSIT
                    || newStatus == ShipmentStatus.CANCELLED;

            case IN_TRANSIT -> newStatus == ShipmentStatus.OUT_FOR_DELIVERY
                    || newStatus == ShipmentStatus.CANCELLED;

            case OUT_FOR_DELIVERY -> newStatus == ShipmentStatus.DELIVERED
                    || newStatus == ShipmentStatus.CANCELLED;

            case DELIVERED, CANCELLED -> false;
        };
    }
    public List<NotificationResponse> getShipmentNotifications(Long shipmentId) {

        CircuitBreaker circuitBreaker =
                circuitBreakerFactory.create("notificationService");

        return circuitBreaker.run(
                () -> notificationClient.getNotificationsByShipmentId(shipmentId),
                throwable -> List.of()
        );
    }

}


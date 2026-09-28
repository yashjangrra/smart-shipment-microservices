package com.shipment.smartshipment.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ShipmentKafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public ShipmentKafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendNotification(String message) {
        kafkaTemplate.send("shipment-notifications", message);
    }
}
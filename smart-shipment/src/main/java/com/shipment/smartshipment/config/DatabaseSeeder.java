package com.shipment.smartshipment.config;

import com.shipment.smartshipment.ShipmentService;
import com.shipment.smartshipment.dto.ShipmentRequest;
import com.shipment.smartshipment.dto.ShipmentResponse;
import com.shipment.smartshipment.entity.ShipmentStatus;
import com.shipment.smartshipment.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentService shipmentService;

    @Override
    public void run(String... args) throws Exception {
        // Run only if the database is completely empty
        if (shipmentRepository.count() == 0) {
            log.info("Database is empty. Seeding dummy shipments...");
            
            String[][] routes = {
                    {"Delhi", "Kerala"},
                    {"Mumbai", "Dubai"},
                    {"Bangalore", "New York"},
                    {"Chennai", "Singapore"},
                    {"Hyderabad", "London"},
                    {"Pune", "Sydney"}
            };

            Random random = new Random();

            for (int i = 1; i <= 20; i++) {
                ShipmentRequest request = new ShipmentRequest();
                request.setTrackingNumber("TRK" + (1000 + i));
                request.setSenderName("Sender " + i);
                request.setReceiverName("Receiver " + i);
                
                String[] route = routes[random.nextInt(routes.length)];
                request.setOrigin(route[0]);
                request.setDestination(route[1]);

                // Create the shipment (Status: CREATED)
                ShipmentResponse response = shipmentService.createShipment(request);

                // Simulate shipments moving through the network to generate Kafka events
                int progress = random.nextInt(4); // 0, 1, 2, or 3
                
                if (progress >= 1) {
                    shipmentService.updateShipmentStatus(response.getId(), ShipmentStatus.IN_TRANSIT);
                }
                if (progress >= 2) {
                    shipmentService.updateShipmentStatus(response.getId(), ShipmentStatus.OUT_FOR_DELIVERY);
                }
                if (progress == 3) {
                    shipmentService.updateShipmentStatus(response.getId(), ShipmentStatus.DELIVERED);
                }
            }
            log.info("Successfully seeded 20 shipments and fired Kafka events!");
        } else {
            log.info("Database already contains shipments. Skipping seeder.");
        }
    }
}

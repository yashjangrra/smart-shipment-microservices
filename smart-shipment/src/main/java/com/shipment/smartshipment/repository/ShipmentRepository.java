package com.shipment.smartshipment.repository;
import com.shipment.smartshipment.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
}
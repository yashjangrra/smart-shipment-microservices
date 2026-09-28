package com.shipment.smartshipment.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;
import jakarta.persistence.PrePersist;
@Entity
@Table(name = "shipments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
    @Column(unique = true,nullable = false)
    @NotBlank(message = "Tracking number is required")
private String trackingNumber;
    @Column(nullable = false)
    @NotBlank(message = "Sender Name is required")
private String senderName;
    @Column(nullable = false)
    @NotBlank(message = "Receiver Name  is required")
private String receiverName;
    @Column(nullable = false)
    @NotBlank(message = "Origin is required")
private String origin;
    @Column(nullable = false)
    @NotBlank(message = "Destination is required")
private String destination;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Status is required")
private ShipmentStatus  status;

private LocalDateTime createdAt;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }



}

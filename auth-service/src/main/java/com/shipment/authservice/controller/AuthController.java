package com.shipment.authservice.controller;

import com.shipment.authservice.dto.LoginRequest;
import com.shipment.authservice.dto.LoginResponse;
import com.shipment.authservice.dto.RegisterRequest;
import com.shipment.authservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(
            @Valid @RequestBody RegisterRequest request) {

        return authService.registerUser(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request) {

        return authService.loginUser(request);
    }
}
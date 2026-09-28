package com.shipment.authservice.security;

import com.shipment.authservice.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Authorization header se JWT lena
        String authHeader = request.getHeader("Authorization");

        // 2. JWT nahi hai toh request ko aage bhej do
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. "Bearer " remove karke actual token lena
        String token = authHeader.substring(7);

        try {

            // 4. JWT valid hai ya nahi check karna
            if (jwtService.isTokenValid(token)) {

                // 5. JWT se username nikalna
                String username = jwtService.extractUsername(token);

                // 6. Authentication object banana
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                Collections.emptyList()
                        );

                // 7. Spring Security ko batana ki user authenticated hai
                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception e) {

            // Invalid JWT hai toh authentication clear kar denge
            SecurityContextHolder.clearContext();
        }

        // 8. Request ko next filter/controller ke paas bhejna
        filterChain.doFilter(request, response);
    }
}
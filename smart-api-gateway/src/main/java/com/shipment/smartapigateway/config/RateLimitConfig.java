package com.shipment.smartapigateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimitConfig {

    @Bean
    public KeyResolver userKeyResolver() {

        return exchange -> {

            String username =
                    exchange.getRequest()
                            .getHeaders()
                            .getFirst("X-User-Name");

            if (username != null && !username.isBlank()) {
                return Mono.just(username);
            }

            return Mono.just(
                    exchange.getRequest()
                            .getRemoteAddress()
                            .getAddress()
                            .getHostAddress()
            );
        };
    }
}

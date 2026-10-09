package com.smartbus.config;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

  // Extra origins for deployments, e.g. APP_CORS_ORIGINS=https://smartbus.vercel.app
  @Value("${APP_CORS_ORIGINS:}")
  private String extraOrigins;

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    List<String> patterns = new ArrayList<>(List.of("http://localhost:*", "http://127.0.0.1:*", "http://192.168.*:*", "http://10.*:*"));
    if (extraOrigins != null && !extraOrigins.isBlank()) {
      for (String o : extraOrigins.split(",")) {
        String origin = o.trim();
        if (!origin.isEmpty() && !patterns.contains(origin)) patterns.add(origin);
      }
    }
    config.setAllowedOriginPatterns(patterns);
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
  }
}

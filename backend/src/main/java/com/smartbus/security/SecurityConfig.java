package com.smartbus.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
  private final JwtAuthFilter jwtAuthFilter;

  public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
    this.jwtAuthFilter = jwtAuthFilter;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> {})
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/error").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/buses", "/api/routes", "/api/stops", "/api/schedules",
                "/api/trips", "/api/trips/*/locations", "/api/predictions").hasAnyRole("OPERATOR", "ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/buses/*", "/api/routes/*", "/api/stops/*",
                "/api/schedules/*", "/api/users/*", "/api/trips/*").authenticated()
            .requestMatchers(HttpMethod.PATCH, "/api/trips/*/status", "/api/notifications/*/read",
                "/api/users/*/notifications/read-all").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/api/buses/*", "/api/routes/*", "/api/stops/*",
                "/api/schedules/*", "/api/trips/*", "/api/users/*/favorites/**").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/notifications/broadcast").hasRole("ADMIN")
            .requestMatchers("/api/**").authenticated()
            .anyRequest().denyAll())
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}

package com.smartbus.controller;

import com.smartbus.dto.AuthResponse;
import com.smartbus.dto.LoginRequest;
import com.smartbus.dto.RegisterRequest;
import com.smartbus.dto.SafeUser;
import com.smartbus.service.AuthService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/auth/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest req) {
    return authService.login(req);
  }

  @PostMapping("/auth/register")
  public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
    return authService.register(req);
  }

  @PutMapping("/users/{id}")
  public SafeUser updateProfile(@PathVariable("id") String id, @RequestBody Map<String, Object> patch) {
    return authService.updateProfile(id, patch);
  }
}

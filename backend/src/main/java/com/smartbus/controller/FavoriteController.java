package com.smartbus.controller;

import com.smartbus.service.FavoriteService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/{userId}/favorites")
public class FavoriteController {
  private final FavoriteService favoriteService;

  public FavoriteController(FavoriteService favoriteService) {
    this.favoriteService = favoriteService;
  }

  @GetMapping("/stops")
  public List<Map<String, Object>> listStops(@PathVariable("userId") String userId) {
    return favoriteService.listStops(userId);
  }

  @GetMapping("/routes")
  public List<Map<String, Object>> listRoutes(@PathVariable("userId") String userId) {
    return favoriteService.listRoutes(userId);
  }

  @PostMapping("/stops")
  public Map<String, Object> addStop(@PathVariable("userId") String userId,
      @RequestBody Map<String, Object> body) {
    return favoriteService.addStop(userId, body);
  }

  @DeleteMapping("/stops/{stopId}")
  public Map<String, Object> removeStop(@PathVariable("userId") String userId,
      @PathVariable("stopId") String stopId) {
    return favoriteService.removeStop(userId, stopId);
  }

  @PostMapping("/routes")
  public Map<String, Object> addRoute(@PathVariable("userId") String userId,
      @RequestBody Map<String, Object> body) {
    return favoriteService.addRoute(userId, body);
  }

  @DeleteMapping("/routes/{routeId}")
  public Map<String, Object> removeRoute(@PathVariable("userId") String userId,
      @PathVariable("routeId") String routeId) {
    return favoriteService.removeRoute(userId, routeId);
  }
}

package com.smartbus.dto;

import com.smartbus.entity.User;
import java.time.Instant;

public class SafeUser {
  private String id;
  private String name;
  private String email;
  private String role;
  private boolean active;
  private String phone;
  private Instant createdAt;

  public static SafeUser from(User u) {
    SafeUser s = new SafeUser();
    s.id = u.getId();
    s.name = u.getName();
    s.email = u.getEmail();
    s.role = u.getRole().name();
    s.active = u.isActive();
    s.phone = u.getPhone();
    s.createdAt = u.getCreatedAt();
    return s;
  }

  public String getId() { return id; }
  public String getName() { return name; }
  public String getEmail() { return email; }
  public String getRole() { return role; }
  public boolean isActive() { return active; }
  public String getPhone() { return phone; }
  public Instant getCreatedAt() { return createdAt; }
}

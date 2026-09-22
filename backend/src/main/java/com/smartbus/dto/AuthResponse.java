package com.smartbus.dto;

public class AuthResponse {
  private String token;
  private SafeUser user;

  public AuthResponse(String token, SafeUser user) {
    this.token = token;
    this.user = user;
  }

  public String getToken() { return token; }
  public SafeUser getUser() { return user; }
}

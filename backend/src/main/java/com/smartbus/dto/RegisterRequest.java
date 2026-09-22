package com.smartbus.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {
  @NotBlank
  private String name;
  @NotBlank @Email
  private String email;
  @NotBlank
  private String password;
  private String role;
  private String phone;
  private String organizationName;
  private String contactNumber;

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }
  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }
  public String getOrganizationName() { return organizationName; }
  public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }
  public String getContactNumber() { return contactNumber; }
  public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}

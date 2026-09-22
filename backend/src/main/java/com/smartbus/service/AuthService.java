package com.smartbus.service;

import com.smartbus.dto.AuthResponse;
import com.smartbus.dto.LoginRequest;
import com.smartbus.dto.RegisterRequest;
import com.smartbus.dto.SafeUser;
import com.smartbus.entity.Passenger;
import com.smartbus.entity.Role;
import com.smartbus.entity.TransportOperator;
import com.smartbus.entity.User;
import com.smartbus.exception.ApiException;
import com.smartbus.repository.PassengerRepository;
import com.smartbus.repository.TransportOperatorRepository;
import com.smartbus.repository.UserRepository;
import com.smartbus.security.JwtUtil;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final PassengerRepository passengerRepository;
  private final TransportOperatorRepository operatorRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final AuditService auditService;

  public AuthService(UserRepository userRepository, PassengerRepository passengerRepository,
      TransportOperatorRepository operatorRepository, PasswordEncoder passwordEncoder,
      JwtUtil jwtUtil, AuditService auditService) {
    this.userRepository = userRepository;
    this.passengerRepository = passengerRepository;
    this.operatorRepository = operatorRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
    this.auditService = auditService;
  }

  public static String currentUserId() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth == null ? null : (String) auth.getPrincipal();
  }

  public static boolean currentHasRole(String role) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth != null && auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
  }

  private String tokenFor(User u) {
    return jwtUtil.generate(u.getId(), u.getEmail(), u.getName(), u.getRole().name());
  }

  @Transactional
  public AuthResponse login(LoginRequest req) {
    User u = userRepository.findByEmail(req.getEmail().trim().toLowerCase())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
    if (!u.isActive()) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Account is disabled.");
    }
    if (!passwordEncoder.matches(req.getPassword(), u.getPasswordHash())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
    }
    auditService.log(u.getId(), "LOGIN", "AUTH", u.getId());
    return new AuthResponse(tokenFor(u), SafeUser.from(u));
  }

  @Transactional
  public AuthResponse register(RegisterRequest req) {
    String email = req.getEmail().trim().toLowerCase();
    if (userRepository.existsByEmail(email)) {
      throw ApiException.badRequest("Email is already registered.");
    }
    Role role;
    try {
      role = Role.valueOf(req.getRole() == null ? "PASSENGER" : req.getRole().trim().toUpperCase());
    } catch (IllegalArgumentException e) {
      throw ApiException.badRequest("Invalid role.");
    }
    User u = new User();
    u.setName(req.getName().trim());
    u.setEmail(email);
    u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
    u.setRole(role);
    u.setActive(true);
    u.setPhone(req.getPhone());
    userRepository.save(u);

    if (role == Role.PASSENGER) {
      Passenger p = new Passenger();
      p.setUserId(u.getId());
      p.setPhone(req.getPhone());
      passengerRepository.save(p);
    } else if (role == Role.OPERATOR) {
      TransportOperator o = new TransportOperator();
      o.setUserId(u.getId());
      o.setOrganizationName(req.getOrganizationName() != null ? req.getOrganizationName() : "");
      o.setContactNumber(req.getContactNumber());
      operatorRepository.save(o);
    }
    auditService.log(u.getId(), "REGISTER", "USER", u.getId());
    return new AuthResponse(tokenFor(u), SafeUser.from(u));
  }

  @Transactional
  public SafeUser updateProfile(String userId, Map<String, Object> patch) {
    String me = currentUserId();
    if (me == null || (!me.equals(userId) && !currentHasRole("ADMIN"))) {
      throw ApiException.forbidden("You can only update your own profile.");
    }
    User u = userRepository.findById(userId)
        .orElseThrow(() -> ApiException.notFound("User not found."));
    if (patch.containsKey("name") && patch.get("name") != null) u.setName(String.valueOf(patch.get("name")));
    if (patch.containsKey("phone")) {
      Object v = patch.get("phone");
      u.setPhone(v == null ? null : String.valueOf(v));
    }
    if (patch.containsKey("email") && patch.get("email") != null) {
      String email = String.valueOf(patch.get("email")).trim().toLowerCase();
      if (!email.equals(u.getEmail()) && userRepository.existsByEmail(email)) {
        throw ApiException.badRequest("Email is already registered.");
      }
      u.setEmail(email);
    }
    userRepository.save(u);
    auditService.log(me, "UPDATE", "USER", u.getId());
    return SafeUser.from(u);
  }
}

package com.smartbus.service;

import com.smartbus.entity.Bus;
import com.smartbus.entity.BusSchedule;
import com.smartbus.entity.BusStatus;
import com.smartbus.entity.TransportOperator;
import com.smartbus.entity.User;
import com.smartbus.exception.ApiException;
import com.smartbus.repository.BusRepository;
import com.smartbus.repository.BusScheduleRepository;
import com.smartbus.repository.TransportOperatorRepository;
import com.smartbus.repository.UserRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BusService {
  private final BusRepository busRepository;
  private final BusScheduleRepository scheduleRepository;
  private final TransportOperatorRepository operatorRepository;
  private final UserRepository userRepository;
  private final AuditService auditService;

  public BusService(BusRepository busRepository, BusScheduleRepository scheduleRepository,
      TransportOperatorRepository operatorRepository, UserRepository userRepository,
      AuditService auditService) {
    this.busRepository = busRepository;
    this.scheduleRepository = scheduleRepository;
    this.operatorRepository = operatorRepository;
    this.userRepository = userRepository;
    this.auditService = auditService;
  }

  public String operatorName(String operatorId) {
    if (operatorId == null) return null;
    return operatorRepository.findById(operatorId).map(o -> {
      if (o.getOrganizationName() != null && !o.getOrganizationName().isBlank()) {
        return o.getOrganizationName();
      }
      return userRepository.findById(o.getUserId()).map(User::getName).orElse(null);
    }).orElse(null);
  }

  public Map<String, Object> decorate(Bus b) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", b.getId());
    m.put("operatorId", b.getOperatorId());
    m.put("busNumber", b.getBusNumber());
    m.put("busType", b.getBusType());
    m.put("capacity", b.getCapacity());
    m.put("status", b.getStatus().name());
    m.put("createdAt", b.getCreatedAt() == null ? null : b.getCreatedAt().toString());
    m.put("operatorName", operatorName(b.getOperatorId()));
    return m;
  }

  private BusStatus parseStatus(Object v) {
    if (v == null) return BusStatus.ACTIVE;
    try {
      return BusStatus.valueOf(String.valueOf(v).trim().toUpperCase());
    } catch (IllegalArgumentException e) {
      throw ApiException.badRequest("Invalid bus status.");
    }
  }

  public List<Map<String, Object>> list() {
    return busRepository.findAll().stream().map(this::decorate).collect(Collectors.toList());
  }

  public Map<String, Object> getById(String id) {
    Bus b = busRepository.findById(id).orElseThrow(() -> ApiException.notFound("Bus not found."));
    return decorate(b);
  }

  @Transactional
  public Map<String, Object> create(Map<String, Object> data) {
    String busNumber = data.get("busNumber") == null ? null : String.valueOf(data.get("busNumber")).trim();
    if (busNumber == null || busNumber.isEmpty()) throw ApiException.badRequest("Bus number is required.");
    if (busRepository.existsByBusNumber(busNumber)) throw ApiException.badRequest("Bus number already exists.");
    Bus b = new Bus();
    b.setBusNumber(busNumber);
    b.setBusType(data.get("busType") == null ? null : String.valueOf(data.get("busType")));
    b.setCapacity(toInt(data.get("capacity")));
    b.setStatus(parseStatus(data.get("status")));
    Object op = data.get("operatorId");
    b.setOperatorId(op == null ? null : String.valueOf(op));
    busRepository.save(b);
    auditService.log(AuthService.currentUserId(), "CREATE", "BUS", b.getId());
    return decorate(b);
  }

  @Transactional
  public Map<String, Object> update(String id, Map<String, Object> data) {
    Bus b = busRepository.findById(id).orElseThrow(() -> ApiException.notFound("Bus not found."));
    if (data.containsKey("busNumber") && data.get("busNumber") != null) {
      String n = String.valueOf(data.get("busNumber")).trim();
      if (!n.equals(b.getBusNumber()) && busRepository.existsByBusNumber(n)) {
        throw ApiException.badRequest("Bus number already exists.");
      }
      b.setBusNumber(n);
    }
    if (data.containsKey("busType")) b.setBusType(data.get("busType") == null ? null : String.valueOf(data.get("busType")));
    if (data.containsKey("capacity")) b.setCapacity(toInt(data.get("capacity")));
    if (data.containsKey("status")) b.setStatus(parseStatus(data.get("status")));
    if (data.containsKey("operatorId")) {
      Object op = data.get("operatorId");
      b.setOperatorId(op == null ? null : String.valueOf(op));
    }
    busRepository.save(b);
    auditService.log(AuthService.currentUserId(), "UPDATE", "BUS", b.getId());
    return decorate(b);
  }

  @Transactional
  public Map<String, Object> remove(String id) {
    Bus b = busRepository.findById(id).orElseThrow(() -> ApiException.notFound("Bus not found."));
    busRepository.delete(b);
    auditService.log(AuthService.currentUserId(), "DELETE", "BUS", id);
    return Map.of("ok", true);
  }

  public List<Map<String, Object>> byRoute(String routeId) {
    List<String> busIds = scheduleRepository.findByRouteId(routeId).stream()
        .map(BusSchedule::getBusId).distinct().collect(Collectors.toList());
    return busRepository.findAllById(busIds).stream().map(this::decorate).collect(Collectors.toList());
  }

  static Integer toInt(Object v) {
    if (v == null || String.valueOf(v).isBlank()) return null;
    try {
      return Integer.valueOf(String.valueOf(v).trim());
    } catch (NumberFormatException e) {
      return null;
    }
  }

  static Double toDouble(Object v) {
    if (v == null || String.valueOf(v).isBlank()) return null;
    try {
      return Double.valueOf(String.valueOf(v).trim());
    } catch (NumberFormatException e) {
      return null;
    }
  }
}

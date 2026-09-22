package com.smartbus.repository;

import com.smartbus.entity.DelayReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DelayReportRepository extends JpaRepository<DelayReport, String> {
}

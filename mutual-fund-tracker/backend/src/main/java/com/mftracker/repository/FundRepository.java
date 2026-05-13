package com.mftracker.repository;

import com.mftracker.model.Fund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundRepository extends JpaRepository<Fund, Long> {
    List<Fund> findByCategory(String category);
    List<Fund> findByRiskLevel(String riskLevel);
    List<Fund> findByNameContainingIgnoreCase(String name);
}

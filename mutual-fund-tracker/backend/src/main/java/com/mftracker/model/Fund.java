package com.mftracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "funds")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String category; // Equity, Debt, Hybrid, Index, ELSS

    @Column(nullable = false)
    private String riskLevel; // Low, Moderate, High

    @Column(name = "current_nav", precision = 10, scale = 4)
    private BigDecimal currentNav; // Latest NAV price

    @Column(name = "fund_size", precision = 15, scale = 2)
    private BigDecimal fundSize; 

   
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "fund", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Investment> investments;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

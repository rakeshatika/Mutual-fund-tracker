package com.mftracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "investments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fund_id", nullable = false)
    private Fund fund;

    @Column(nullable = false, precision = 12, scale = 4)
    private BigDecimal units;

    @Column(name = "purchase_nav", nullable = false, precision = 10, scale = 4)
    private BigDecimal purchaseNav;

    @Column(name = "invested_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal investedAmount;

    @Column(name = "investment_type")
    private String investmentType; // Lumpsum, SIP

    @PrePersist
    protected void onCreate() {

        // Calculate invested amount from units * purchase NAV
        if (units != null && purchaseNav != null) {
            investedAmount = units.multiply(purchaseNav).setScale(2, RoundingMode.HALF_UP);
        }
    }

    // Transient computed fields

    @Transient
    public BigDecimal getCurrentValue() {
        if (units == null || fund == null || fund.getCurrentNav() == null) return BigDecimal.ZERO;
        return units.multiply(fund.getCurrentNav()).setScale(2, RoundingMode.HALF_UP);
    }

    @Transient
    public BigDecimal getProfitLoss() {
        if (investedAmount == null) return BigDecimal.ZERO;
        return getCurrentValue().subtract(investedAmount);
    }

    @Transient
    public BigDecimal getProfitLossPercent() {
        if (investedAmount == null || investedAmount.compareTo(BigDecimal.ZERO) == 0)
            return BigDecimal.ZERO;
        return getProfitLoss()
                .divide(investedAmount, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP);
    }
}

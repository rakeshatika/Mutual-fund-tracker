package com.mftracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentResponse {
    private Long id;
    private Long fundId;
    private String fundName;
    private String fundCategory;
    private String riskLevel;
    private BigDecimal units;
    private BigDecimal investedAmount;
    private BigDecimal currentValue;

    private BigDecimal profitLossPercent;

    private String investmentType;

}

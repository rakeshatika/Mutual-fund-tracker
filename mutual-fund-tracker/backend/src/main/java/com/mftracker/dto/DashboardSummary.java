package com.mftracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummary {

    private BigDecimal totalInvested;
    private BigDecimal totalCurrentValue;
    private BigDecimal totalProfitLoss;
    private BigDecimal totalProfitLossPercent;
    private Long totalFunds;
    private Long totalInvestments;
    private List<FundAllocation> fundAllocations;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FundAllocation {
        private String fundName;
        private String category;
        private BigDecimal investedAmount;
        private BigDecimal currentValue;
        private BigDecimal profitLoss;
        private BigDecimal profitLossPercent;
        private BigDecimal allocationPercent;
    }
}

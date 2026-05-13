package com.mftracker.service;

import com.mftracker.dto.DashboardSummary;
import com.mftracker.model.Investment;
import com.mftracker.repository.InvestmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private InvestmentRepository investmentRepository;

    public DashboardSummary getSummary(Long userId) {
        List<Investment> investments = investmentRepository.findByUserId(userId);

        BigDecimal totalInvested = investments.stream()
                .map(Investment::getInvestedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCurrentValue = investments.stream()
                .map(Investment::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalProfitLoss = totalCurrentValue.subtract(totalInvested);

        BigDecimal totalProfitLossPercent = totalInvested.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : totalProfitLoss.divide(totalInvested, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"))
                        .setScale(2, RoundingMode.HALF_UP);

        long totalFunds = investments.stream()
                .map(i -> i.getFund().getId())
                .distinct().count();

        // Group by fund for allocation breakdown
        Map<Long, List<Investment>> byFund = investments.stream()
                .collect(Collectors.groupingBy(i -> i.getFund().getId()));

        List<DashboardSummary.FundAllocation> allocations = byFund.values().stream()
                .map(fundInvestments -> {
                    String fundName = fundInvestments.get(0).getFund().getName();
                    String category = fundInvestments.get(0).getFund().getCategory();

                    BigDecimal invested = fundInvestments.stream()
                            .map(Investment::getInvestedAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal current = fundInvestments.stream()
                            .map(Investment::getCurrentValue)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal pl = current.subtract(invested);

                    BigDecimal plPercent = invested.compareTo(BigDecimal.ZERO) == 0
                            ? BigDecimal.ZERO
                            : pl.divide(invested, 4, RoundingMode.HALF_UP)
                                    .multiply(new BigDecimal("100"))
                                    .setScale(2, RoundingMode.HALF_UP);

                    BigDecimal allocPercent = totalCurrentValue.compareTo(BigDecimal.ZERO) == 0
                            ? BigDecimal.ZERO
                            : current.divide(totalCurrentValue, 4, RoundingMode.HALF_UP)
                                    .multiply(new BigDecimal("100"))
                                    .setScale(2, RoundingMode.HALF_UP);

                    return new DashboardSummary.FundAllocation(
                            fundName, category, invested, current, pl, plPercent, allocPercent);
                })
                .sorted(Comparator.comparing(DashboardSummary.FundAllocation::getCurrentValue).reversed())
                .collect(Collectors.toList());

        return new DashboardSummary(
                totalInvested, totalCurrentValue, totalProfitLoss,
                totalProfitLossPercent, totalFunds, (long) investments.size(), allocations);
    }
}

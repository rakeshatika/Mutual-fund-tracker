package com.mftracker.service;

import com.mftracker.dto.InvestmentRequest;
import com.mftracker.dto.InvestmentResponse;
import com.mftracker.model.Fund;
import com.mftracker.model.Investment;
import com.mftracker.model.User;
import com.mftracker.repository.FundRepository;
import com.mftracker.repository.InvestmentRepository;
import com.mftracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FundRepository fundRepository;

    @Transactional
    public InvestmentResponse addInvestment(Long userId, InvestmentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Fund fund = fundRepository.findById(request.getFundId())
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        Investment investment = new Investment();
        investment.setUser(user);
        investment.setFund(fund);
        investment.setUnits(request.getUnits());
        // Use fund's current NAV as the purchase NAV (no longer supplied by client)
        investment.setPurchaseNav(fund.getCurrentNav());
        investment.setInvestmentType(request.getInvestmentType());

        Investment saved = investmentRepository.save(investment);
        return mapToResponse(saved);
    }

    public List<InvestmentResponse> getUserInvestments(Long userId) {
        return investmentRepository.findByUserIdOrderByIdDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public InvestmentResponse getInvestmentById(Long investmentId, Long userId) {
        Investment investment = investmentRepository.findById(investmentId)
                .orElseThrow(() -> new RuntimeException("Investment not found"));

        if (!investment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to investment");
        }
        return mapToResponse(investment);
    }

    @Transactional
    public void deleteInvestment(Long investmentId, Long userId) {
        Investment investment = investmentRepository.findById(investmentId)
                .orElseThrow(() -> new RuntimeException("Investment not found"));

        if (!investment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to investment");
        }
        investmentRepository.delete(investment);
    }

    private InvestmentResponse mapToResponse(Investment inv) {
        InvestmentResponse res = new InvestmentResponse();
        res.setId(inv.getId());
        res.setFundId(inv.getFund().getId());
        res.setFundName(inv.getFund().getName());
        res.setFundCategory(inv.getFund().getCategory());
        res.setRiskLevel(inv.getFund().getRiskLevel());
        res.setUnits(inv.getUnits());
        res.setInvestedAmount(inv.getInvestedAmount());
        res.setCurrentValue(inv.getCurrentValue());
       
        res.setProfitLossPercent(inv.getProfitLossPercent());
        
        res.setInvestmentType(inv.getInvestmentType());
       
        return res;
    }
}

package com.mftracker.service;

import com.mftracker.model.Fund;
import com.mftracker.repository.FundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class FundService {

    @Autowired
    private FundRepository fundRepository;

    public List<Fund> getAllFunds() {
        return fundRepository.findAll();
    }

    public Optional<Fund> getFundById(@NonNull Long id) {
        return fundRepository.findById(id);
    }

    public List<Fund> getFundsByCategory(String category) {
        return fundRepository.findByCategory(category);
    }

    public List<Fund> searchFunds(String name) {
        return fundRepository.findByNameContainingIgnoreCase(name);
    }

    public @NonNull Fund createFund(@NonNull Fund fund) {
        return Objects.requireNonNull(fundRepository.save(fund));
    }

    public Fund updateFund(Long id, Fund updatedFund) {
        return fundRepository.findById(id).map(fund -> {
            fund.setName(updatedFund.getName());
            fund.setCategory(updatedFund.getCategory());
            fund.setRiskLevel(updatedFund.getRiskLevel());
            fund.setCurrentNav(updatedFund.getCurrentNav());
           
         
            fund.setFundSize(updatedFund.getFundSize());
            
            return Objects.requireNonNull(fundRepository.save(fund));
        }).orElseThrow(() -> new RuntimeException("Fund not found with id: " + id));
    }

    public void deleteFund(Long id) {
        fundRepository.deleteById(id);
    }
}

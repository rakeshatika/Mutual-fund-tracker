package com.mftracker.controller;

import com.mftracker.dto.InvestmentRequest;
import com.mftracker.dto.InvestmentResponse;
import com.mftracker.model.User;
import com.mftracker.repository.UserRepository;
import com.mftracker.service.InvestmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    @Autowired
    private UserRepository userRepository;

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<InvestmentResponse>> getMyInvestments() {
        return ResponseEntity.ok(investmentService.getUserInvestments(getCurrentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestmentResponse> getInvestmentById(@PathVariable Long id) {
        return ResponseEntity.ok(investmentService.getInvestmentById(id, getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<InvestmentResponse> addInvestment(@Valid @RequestBody InvestmentRequest request) {
        return ResponseEntity.ok(investmentService.addInvestment(getCurrentUserId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvestment(@PathVariable Long id) {
        investmentService.deleteInvestment(id, getCurrentUserId());
        return ResponseEntity.ok(Map.of("message", "Investment deleted successfully"));
    }
}

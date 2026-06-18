package com.mftracker.controller;

import com.mftracker.model.Fund;
import com.mftracker.service.FundService;
import jakarta.validation.Valid;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/funds")
public class FundController {

    @Autowired
    private FundService fundService;

    @GetMapping
    public ResponseEntity<List<Fund>> getAllFunds(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(fundService.searchFunds(search));
        }
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(fundService.getFundsByCategory(category));
        }
        return ResponseEntity.ok(fundService.getAllFunds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fund> getFundById(@PathVariable @NonNull Long id) {
        return fundService.getFundById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Fund> createFund(@Valid @RequestBody Fund fund) {
        return ResponseEntity.ok(fundService.createFund(fund));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fund> updateFund(@PathVariable Long id, @Valid @RequestBody Fund fund) {
        return ResponseEntity.ok(fundService.updateFund(id, fund));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFund(@PathVariable Long id) {
        fundService.deleteFund(id);
        return ResponseEntity.ok(Map.of("message", "Fund deleted successfully"));
    }
}

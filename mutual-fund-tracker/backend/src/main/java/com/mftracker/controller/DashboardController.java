package com.mftracker.controller;

import com.mftracker.dto.DashboardSummary;
import com.mftracker.model.User;
import com.mftracker.repository.UserRepository;
import com.mftracker.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(dashboardService.getSummary(user.getId()));
    }
}

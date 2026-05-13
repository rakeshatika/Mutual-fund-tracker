package com.mftracker.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;


@Data
public class InvestmentRequest {

    @NotNull
    private Long fundId;

    @NotNull
    @Positive
    private BigDecimal units;
    

    private String investmentType; // Lumpsum, SIP

    private String notes;
}

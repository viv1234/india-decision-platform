package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.DiscountRequestDto;
import com.indiadecision.platform.dto.DiscountResponseDto;

public interface DiscountCalculatorService {
    DiscountResponseDto calculateDiscount(DiscountRequestDto request);
}

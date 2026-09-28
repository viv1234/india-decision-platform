package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.PercentageRequestDto;
import com.indiadecision.platform.dto.PercentageResponseDto;

public interface PercentageCalculatorService {
    PercentageResponseDto calculatePercentage(PercentageRequestDto request);
}

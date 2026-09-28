package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.EmiRequestDto;
import com.indiadecision.platform.dto.EmiResponseDto;

public interface EmiCalculatorService {
    EmiResponseDto calculateEmi(EmiRequestDto request);
}

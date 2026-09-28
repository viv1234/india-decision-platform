package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.InflationRequestDto;
import com.indiadecision.platform.dto.InflationResponseDto;

public interface InflationCalculatorService {
    InflationResponseDto calculateInflation(InflationRequestDto request);
}

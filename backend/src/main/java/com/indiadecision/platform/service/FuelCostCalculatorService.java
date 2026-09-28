package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.FuelCostRequestDto;
import com.indiadecision.platform.dto.FuelCostResponseDto;

public interface FuelCostCalculatorService {
    FuelCostResponseDto calculateFuelCost(FuelCostRequestDto request);
}

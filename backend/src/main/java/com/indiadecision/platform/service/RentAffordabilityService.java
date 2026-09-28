package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.RentAffordabilityRequestDto;
import com.indiadecision.platform.dto.RentAffordabilityResponseDto;

public interface RentAffordabilityService {
    RentAffordabilityResponseDto calculateRentAffordability(RentAffordabilityRequestDto request);
}

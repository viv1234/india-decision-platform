package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.FdRequestDto;
import com.indiadecision.platform.dto.FdResponseDto;

public interface FdCalculatorService {
    FdResponseDto calculateFd(FdRequestDto request);
}

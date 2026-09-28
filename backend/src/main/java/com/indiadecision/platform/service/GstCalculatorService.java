package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.GstRequestDto;
import com.indiadecision.platform.dto.GstResponseDto;

public interface GstCalculatorService {
    GstResponseDto calculateGst(GstRequestDto request);
}

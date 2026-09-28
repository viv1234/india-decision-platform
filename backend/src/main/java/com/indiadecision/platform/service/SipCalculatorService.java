package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.SipRequestDto;
import com.indiadecision.platform.dto.SipResponseDto;

public interface SipCalculatorService {
    SipResponseDto calculateSip(SipRequestDto request);
}

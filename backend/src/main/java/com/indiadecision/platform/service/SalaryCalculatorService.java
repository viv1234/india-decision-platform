package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.SalaryRequestDto;
import com.indiadecision.platform.dto.SalaryResponseDto;

public interface SalaryCalculatorService {
    SalaryResponseDto calculateSalary(SalaryRequestDto request);
}

package com.indiadecision.platform.repository;

import com.indiadecision.platform.entity.CalculatorUsageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalculatorUsageRepository extends JpaRepository<CalculatorUsageEntity, String> {
}

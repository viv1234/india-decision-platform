package com.indiadecision.platform.repository;

import com.indiadecision.platform.entity.CalculatorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalculatorRepository extends JpaRepository<CalculatorEntity, String> {
    List<CalculatorEntity> findByActiveTrueOrderByDisplayOrderAsc();
    List<CalculatorEntity> findByCategoryAndActiveTrue(String category);
}

package com.indiadecision.platform.repository;

import com.indiadecision.platform.entity.SavedCalculationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedCalculationRepository extends JpaRepository<SavedCalculationEntity, String> {
    List<SavedCalculationEntity> findByUserIdOrderByCreatedAtDesc(String userId);
}

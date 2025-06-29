package com.pawpal.repository;

import com.pawpal.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByIsActiveTrue();
    
    List<Service> findByCategory(Service.Category category);
    
    List<Service> findByCategoryAndIsActiveTrue(Service.Category category);
    
    @Query("SELECT s FROM Service s WHERE s.price BETWEEN :minPrice AND :maxPrice AND s.isActive = true")
    List<Service> findByPriceRangeAndIsActiveTrue(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT s FROM Service s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%')) AND s.isActive = true")
    List<Service> findByNameContainingIgnoreCaseAndIsActiveTrue(@Param("name") String name);
    
    @Query("SELECT s FROM Service s WHERE s.durationMinutes <= :maxDuration AND s.isActive = true")
    List<Service> findByMaxDurationAndIsActiveTrue(@Param("maxDuration") Integer maxDuration);
}

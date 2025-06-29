package com.pawpal.repository;

import com.pawpal.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    
    List<Booking> findByPetId(Long petId);
    
    List<Booking> findByServiceId(Long serviceId);
    
    List<Booking> findByStatus(Booking.Status status);
    
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId ORDER BY b.bookingDate DESC")
    List<Booking> findByCustomerIdOrderByBookingDateDesc(@Param("customerId") Long customerId);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByBookingDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByStatusAndBookingDateBetween(@Param("status") Booking.Status status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.customer.id = :customerId")
    Long countByCustomerId(@Param("customerId") Long customerId);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDate >= :date ORDER BY b.bookingDate ASC")
    List<Booking> findUpcomingBookings(@Param("date") LocalDateTime date);
}

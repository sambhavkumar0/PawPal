package com.pawpal.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class BookingDto {
    @NotNull(message = "Pet ID is required")
    private Long petId;

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Booking date is required")
    private String bookingDate;

    private String notes;

    // Constructors
    public BookingDto() {}

    public BookingDto(Long petId, Long serviceId, String bookingDate, String notes) {
        this.petId = petId;
        this.serviceId = serviceId;
        this.bookingDate = bookingDate;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    @Override
    public String toString() {
        return "BookingDto{" +
                "petId=" + petId +
                ", serviceId=" + serviceId +
                ", bookingDate='" + bookingDate + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }
}

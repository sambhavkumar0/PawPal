package com.pawpal.service;

import com.pawpal.dto.BookingDto;
import com.pawpal.entity.Booking;
import com.pawpal.entity.Pet;
import com.pawpal.entity.Service;
import com.pawpal.entity.User;
import com.pawpal.exception.ResourceNotFoundException;
import com.pawpal.repository.BookingRepository;
import com.pawpal.repository.PetRepository;
import com.pawpal.repository.ServiceRepository;
import com.pawpal.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@org.springframework.stereotype.Service
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Transactional
    public Booking createBooking(BookingDto bookingDto, String userEmail) {
        logger.info("Creating booking for user: {} with data: {}", userEmail, bookingDto);

        try {
            // Find user by email
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (!userOpt.isPresent()) {
                logger.error("User not found with email: {}", userEmail);
                throw new ResourceNotFoundException("User not found with email: " + userEmail);
            }
            User user = userOpt.get();
            logger.info("Found user: {} (ID: {})", user.getEmail(), user.getId());

            // Find pet by ID
            Optional<Pet> petOpt = petRepository.findById(bookingDto.getPetId());
            if (!petOpt.isPresent()) {
                logger.error("Pet not found with ID: {}", bookingDto.getPetId());
                throw new ResourceNotFoundException("Pet not found with ID: " + bookingDto.getPetId());
            }
            Pet pet = petOpt.get();
            logger.info("Found pet: {} (ID: {})", pet.getName(), pet.getId());

            // Verify pet belongs to user - using ownerId from Pet entity
            if (!Objects.equals(pet.getOwnerId(), user.getId())) {
                logger.error("Pet {} has ownerId {}, does not match userId {}", pet.getId(), pet.getOwnerId(), user.getId());
                throw new IllegalArgumentException("Pet does not belong to the authenticated user");
            }

            // Find service by ID
            Optional<Service> serviceOpt = serviceRepository.findById(bookingDto.getServiceId());
            if (!serviceOpt.isPresent()) {
                logger.error("Service not found with ID: {}", bookingDto.getServiceId());
                throw new ResourceNotFoundException("Service not found with ID: " + bookingDto.getServiceId());
            }
            Service service = serviceOpt.get();
            logger.info("Found service: {} (ID: {}) with price: {}", service.getName(), service.getId(), service.getPrice());

            // Parse booking date
            LocalDateTime bookingDate;
            try {
                bookingDate = LocalDateTime.parse(bookingDto.getBookingDate(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                logger.info("Parsed booking date: {}", bookingDate);
            } catch (Exception e) {
                logger.error("Invalid booking date format: {}", bookingDto.getBookingDate(), e);
                throw new IllegalArgumentException("Invalid booking date format: " + bookingDto.getBookingDate());
            }

            // Create booking
            Booking booking = new Booking();
            booking.setCustomer(user);
            booking.setPet(pet);
            booking.setService(service);
            booking.setBookingDate(bookingDate);
            booking.setNotes(bookingDto.getNotes() != null ? bookingDto.getNotes() : "");
            booking.setStatus(Booking.Status.PENDING);
            booking.setCreatedAt(LocalDateTime.now());
            booking.setUpdatedAt(LocalDateTime.now());

            // Set total price - ensure it's BigDecimal
            BigDecimal totalPrice = service.getPrice();
            if (totalPrice == null) {
                totalPrice = BigDecimal.ZERO;
                logger.warn("Service {} has null price, setting to 0", service.getId());
            }
            booking.setTotalPrice(totalPrice);
            logger.info("Set booking total price to: {}", totalPrice);

            // Save booking
            Booking savedBooking = bookingRepository.save(booking);
            logger.info("Successfully created booking with ID: {}", savedBooking.getId());

            return savedBooking;

        } catch (Exception e) {
            logger.error("Error creating booking: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<Booking> getBookingsByUser(String userEmail) {
        logger.info("Fetching bookings for user: {}", userEmail);

        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (!userOpt.isPresent()) {
            throw new ResourceNotFoundException("User not found with email: " + userEmail);
        }

        List<Booking> bookings = bookingRepository.findByCustomerId(userOpt.get().getId());
        logger.info("Found {} bookings for user: {}", bookings.size(), userEmail);

        return bookings;
    }

    public List<Booking> getAllBookings() {
        logger.info("Fetching all bookings");
        List<Booking> bookings = bookingRepository.findAll();
        logger.info("Found {} total bookings", bookings.size());
        return bookings;
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, Booking.Status status) {
        logger.info("Updating booking {} status to: {}", bookingId, status);

        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            throw new ResourceNotFoundException("Booking not found with ID: " + bookingId);
        }

        Booking booking = bookingOpt.get();
        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());

        Booking updatedBooking = bookingRepository.save(booking);
        logger.info("Successfully updated booking {} status to: {}", bookingId, status);

        return updatedBooking;
    }

    public Booking getBookingById(Long bookingId) {
        logger.info("Fetching booking with ID: {}", bookingId);

        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            throw new ResourceNotFoundException("Booking not found with ID: " + bookingId);
        }

        return bookingOpt.get();
    }

    @Transactional
    public void deleteBooking(Long bookingId) {
        logger.info("Deleting booking with ID: {}", bookingId);

        if (!bookingRepository.existsById(bookingId)) {
            throw new ResourceNotFoundException("Booking not found with ID: " + bookingId);
        }

        bookingRepository.deleteById(bookingId);
        logger.info("Successfully deleted booking with ID: {}", bookingId);
    }
}

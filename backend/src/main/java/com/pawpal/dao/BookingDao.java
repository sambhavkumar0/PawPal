package com.pawpal.dao;

import com.pawpal.entity.Booking;
import com.pawpal.entity.Pet;
import com.pawpal.entity.Service;
import com.pawpal.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Repository
public class BookingDao extends BaseDao {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PetDao petDao;

    @Autowired
    private ServiceDao serviceDao;

    private static final String INSERT_BOOKING =
            "INSERT INTO bookings (customer_id, pet_id, service_id, booking_date, status, total_price, notes, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BOOKING_BY_ID =
            "SELECT * FROM bookings WHERE id = ?";

    private static final String SELECT_BOOKINGS_BY_CUSTOMER =
            "SELECT * FROM bookings WHERE customer_id = ? ORDER BY booking_date DESC";

    private static final String SELECT_ALL_BOOKINGS =
            "SELECT * FROM bookings ORDER BY booking_date DESC";

    private static final String UPDATE_BOOKING =
            "UPDATE bookings SET customer_id = ?, pet_id = ?, service_id = ?, booking_date = ?, status = ?, total_price = ?, notes = ?, updated_at = ? WHERE id = ?";

    private static final String UPDATE_BOOKING_STATUS =
            "UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?";

    private static final String DELETE_BOOKING =
            "DELETE FROM bookings WHERE id = ?";

    private static final String SELECT_UPCOMING_BOOKINGS =
            "SELECT * FROM bookings WHERE booking_date >= ? ORDER BY booking_date ASC";

    private static final String SELECT_BOOKINGS_BY_STATUS =
            "SELECT * FROM bookings WHERE status = ? ORDER BY booking_date DESC";

    private static final String SELECT_BOOKINGS_BY_DATE_RANGE =
            "SELECT * FROM bookings WHERE booking_date BETWEEN ? AND ? ORDER BY booking_date ASC";

    public Booking save(Booking booking) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();

            if (booking.getId() == null) {
                stmt = conn.prepareStatement(INSERT_BOOKING, new String[]{"id"});

                setParameter(stmt, 1, booking.getCustomer().getId());
                setParameter(stmt, 2, booking.getPet().getId());
                setParameter(stmt, 3, booking.getService().getId());
                setParameter(stmt, 4, toTimestamp(booking.getBookingDate()));
                setParameter(stmt, 5, booking.getStatus().name());

                // Handle BigDecimal carefully
                BigDecimal totalPrice = booking.getTotalPrice();
                if (totalPrice == null) {
                    totalPrice = new BigDecimal("0.00");
                }
                logger.debug("Setting total price: {} (type: {})", totalPrice, totalPrice.getClass().getSimpleName());
                setParameter(stmt, 6, totalPrice);

                setParameter(stmt, 7, booking.getNotes());
                setParameter(stmt, 8, toTimestamp(LocalDateTime.now()));
                setParameter(stmt, 9, toTimestamp(LocalDateTime.now()));

                int affectedRows = stmt.executeUpdate();
                if (affectedRows > 0) {
                    rs = stmt.getGeneratedKeys();
                    if (rs.next()) {
                        booking.setId(rs.getLong(1));
                    }
                }
                logger.info("Booking created with ID: {}", booking.getId());
            } else {
                stmt = conn.prepareStatement(UPDATE_BOOKING);

                setParameter(stmt, 1, booking.getCustomer().getId());
                setParameter(stmt, 2, booking.getPet().getId());
                setParameter(stmt, 3, booking.getService().getId());
                setParameter(stmt, 4, toTimestamp(booking.getBookingDate()));
                setParameter(stmt, 5, booking.getStatus().name());

                // Handle BigDecimal carefully
                BigDecimal totalPrice = booking.getTotalPrice();
                if (totalPrice == null) {
                    totalPrice = new BigDecimal("0.00");
                }
                setParameter(stmt, 6, totalPrice);

                setParameter(stmt, 7, booking.getNotes());
                setParameter(stmt, 8, toTimestamp(LocalDateTime.now()));
                setParameter(stmt, 9, booking.getId());

                stmt.executeUpdate();
                logger.info("Booking updated with ID: {}", booking.getId());
            }

            return booking;

        } catch (SQLException e) {
            logger.error("Error saving booking", e);
            throw new RuntimeException("Failed to save booking", e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }

    public Optional<Booking> findById(Long id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_BOOKING_BY_ID);
            setParameter(stmt, 1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return Optional.of(mapResultSetToBooking(rs));
            }

            return Optional.empty();

        } catch (SQLException e) {
            logger.error("Error finding booking by ID: {}", id, e);
            throw new RuntimeException("Failed to find booking", e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }

    public List<Booking> findByCustomerId(Long customerId) {
        List<Booking> bookings = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_BOOKINGS_BY_CUSTOMER);
            setParameter(stmt, 1, customerId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                bookings.add(mapResultSetToBooking(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding bookings by customer ID: {}", customerId, e);
            throw new RuntimeException("Failed to find bookings", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return bookings;
    }

    public List<Booking> findAll() {
        List<Booking> bookings = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_ALL_BOOKINGS);
            rs = stmt.executeQuery();

            while (rs.next()) {
                bookings.add(mapResultSetToBooking(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding all bookings", e);
            throw new RuntimeException("Failed to find bookings", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return bookings;
    }

    public List<Booking> findUpcomingBookings() {
        List<Booking> bookings = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_UPCOMING_BOOKINGS);
            setParameter(stmt, 1, toTimestamp(LocalDateTime.now()));
            rs = stmt.executeQuery();

            while (rs.next()) {
                bookings.add(mapResultSetToBooking(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding upcoming bookings", e);
            throw new RuntimeException("Failed to find upcoming bookings", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return bookings;
    }

    public List<Booking> findByStatus(Booking.Status status) {
        List<Booking> bookings = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_BOOKINGS_BY_STATUS);
            setParameter(stmt, 1, status.name());
            rs = stmt.executeQuery();

            while (rs.next()) {
                bookings.add(mapResultSetToBooking(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding bookings by status: {}", status, e);
            throw new RuntimeException("Failed to find bookings by status", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return bookings;
    }

    public List<Booking> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Booking> bookings = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_BOOKINGS_BY_DATE_RANGE);
            setParameter(stmt, 1, toTimestamp(startDate));
            setParameter(stmt, 2, toTimestamp(endDate));
            rs = stmt.executeQuery();

            while (rs.next()) {
                bookings.add(mapResultSetToBooking(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding bookings by date range", e);
            throw new RuntimeException("Failed to find bookings by date range", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return bookings;
    }

    public void updateStatus(Long bookingId, Booking.Status status) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(UPDATE_BOOKING_STATUS);
            setParameter(stmt, 1, status.name());
            setParameter(stmt, 2, toTimestamp(LocalDateTime.now()));
            setParameter(stmt, 3, bookingId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                logger.info("Booking status updated for ID: {} to {}", bookingId, status);
            }

        } catch (SQLException e) {
            logger.error("Error updating booking status for ID: {}", bookingId, e);
            throw new RuntimeException("Failed to update booking status", e);
        } finally {
            closeResources(conn, stmt);
        }
    }

    public void deleteById(Long id) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(DELETE_BOOKING);
            setParameter(stmt, 1, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                logger.info("Booking deleted with ID: {}", id);
            }

        } catch (SQLException e) {
            logger.error("Error deleting booking with ID: {}", id, e);
            throw new RuntimeException("Failed to delete booking", e);
        } finally {
            closeResources(conn, stmt);
        }
    }

    private Booking mapResultSetToBooking(ResultSet rs) throws SQLException {
        try {
            logger.debug("Mapping ResultSet to Booking entity");

            Booking booking = new Booking();
            booking.setId(rs.getLong("id"));

            // Load customer
            Long customerId = rs.getLong("customer_id");
            if (!rs.wasNull()) {
                Optional<User> customer = userDao.findById(customerId);
                if (customer.isPresent()) {
                    booking.setCustomer(customer.get());
                } else {
                    logger.warn("Customer not found with ID: {}", customerId);
                    // Create a minimal user object to avoid null pointer
                    User user = new User();
                    user.setId(customerId);
                    booking.setCustomer(user);
                }
            }

            // Load pet
            Long petId = rs.getLong("pet_id");
            if (!rs.wasNull()) {
                Optional<Pet> pet = petDao.findById(petId);
                if (pet.isPresent()) {
                    booking.setPet(pet.get());
                } else {
                    logger.warn("Pet not found with ID: {}", petId);
                    // Create a minimal pet object to avoid null pointer
                    Pet petObj = new Pet();
                    petObj.setId(petId);
                    booking.setPet(petObj);
                }
            }

            // Load service
            Long serviceId = rs.getLong("service_id");
            if (!rs.wasNull()) {
                Optional<Service> service = serviceDao.findById(serviceId);
                if (service.isPresent()) {
                    booking.setService(service.get());
                } else {
                    logger.warn("Service not found with ID: {}", serviceId);
                    // Create a minimal service object to avoid null pointer
                    Service serviceObj = new Service();
                    serviceObj.setId(serviceId);
                    booking.setService(serviceObj);
                }
            }

            booking.setBookingDate(toLocalDateTime(rs.getTimestamp("booking_date")));

            // Handle status enum
            String statusStr = rs.getString("status");
            if (statusStr != null) {
                try {
                    booking.setStatus(Booking.Status.valueOf(statusStr));
                } catch (IllegalArgumentException e) {
                    logger.warn("Invalid booking status: {}, defaulting to PENDING", statusStr);
                    booking.setStatus(Booking.Status.PENDING);
                }
            }

            // Handle BigDecimal properly
            try {
                BigDecimal totalPrice = rs.getBigDecimal("total_price");
                logger.debug("Retrieved total_price from DB: {} (type: {})",
                        totalPrice, totalPrice != null ? totalPrice.getClass().getSimpleName() : "null");

                if (totalPrice != null) {
                    booking.setTotalPrice(totalPrice);
                } else {
                    booking.setTotalPrice(new BigDecimal("0.00"));
                }
            } catch (Exception e) {
                logger.error("Error handling total_price field: {}", e.getMessage(), e);
                booking.setTotalPrice(new BigDecimal("0.00"));
            }

            booking.setNotes(rs.getString("notes"));
            booking.setCreatedAt(toLocalDateTime(rs.getTimestamp("created_at")));
            booking.setUpdatedAt(toLocalDateTime(rs.getTimestamp("updated_at")));

            logger.debug("Successfully mapped booking entity with ID: {}", booking.getId());
            return booking;

        } catch (Exception e) {
            logger.error("Error mapping ResultSet to Booking entity: {}", e.getMessage(), e);
            throw new SQLException("Failed to map booking entity", e);
        }
    }
}

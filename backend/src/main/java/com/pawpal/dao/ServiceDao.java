package com.pawpal.dao;

import com.pawpal.entity.Service;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Repository
public class ServiceDao extends BaseDao {

    private static final String INSERT_SERVICE =
            "INSERT INTO services (name, description, price, duration_minutes, category, is_active, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_SERVICE_BY_ID =
            "SELECT * FROM services WHERE id = ?";

    private static final String SELECT_ALL_SERVICES =
            "SELECT * FROM services ORDER BY name";

    private static final String SELECT_ACTIVE_SERVICES =
            "SELECT * FROM services WHERE is_active = 1 ORDER BY name";

    private static final String SELECT_SERVICES_BY_CATEGORY =
            "SELECT * FROM services WHERE category = ? ORDER BY name";

    private static final String UPDATE_SERVICE =
            "UPDATE services SET name = ?, description = ?, price = ?, duration_minutes = ?, category = ?, is_active = ?, updated_at = ? WHERE id = ?";

    private static final String DELETE_SERVICE =
            "DELETE FROM services WHERE id = ?";

    public Service save(Service service) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();

            if (service.getId() == null) {
                stmt = conn.prepareStatement(INSERT_SERVICE, new String[]{"id"});
                setParameter(stmt, 1, service.getName());
                setParameter(stmt, 2, service.getDescription());
                setParameter(stmt, 3, service.getPrice());
                setParameter(stmt, 4, service.getDurationMinutes());
                setParameter(stmt, 5, service.getCategory() != null ? service.getCategory().name() : null);
                setParameter(stmt, 6, service.getIsActive() ? 1 : 0);
                setParameter(stmt, 7, toTimestamp(LocalDateTime.now()));
                setParameter(stmt, 8, toTimestamp(LocalDateTime.now()));

                int affectedRows = stmt.executeUpdate();
                if (affectedRows > 0) {
                    rs = stmt.getGeneratedKeys();
                    if (rs.next()) {
                        service.setId(rs.getLong(1));
                    }
                }
                logger.info("Service created with ID: {}", service.getId());
            } else {
                stmt = conn.prepareStatement(UPDATE_SERVICE);
                setParameter(stmt, 1, service.getName());
                setParameter(stmt, 2, service.getDescription());
                setParameter(stmt, 3, service.getPrice());
                setParameter(stmt, 4, service.getDurationMinutes());
                setParameter(stmt, 5, service.getCategory() != null ? service.getCategory().name() : null);
                setParameter(stmt, 6, service.getIsActive() ? 1 : 0);
                setParameter(stmt, 7, toTimestamp(LocalDateTime.now()));
                setParameter(stmt, 8, service.getId());

                stmt.executeUpdate();
                logger.info("Service updated with ID: {}", service.getId());
            }

            return service;

        } catch (SQLException e) {
            logger.error("Error saving service", e);
            throw new RuntimeException("Failed to save service", e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }

    public Optional<Service> findById(Long id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_SERVICE_BY_ID);
            setParameter(stmt, 1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return Optional.of(mapResultSetToService(rs));
            }

            return Optional.empty();

        } catch (SQLException e) {
            logger.error("Error finding service by ID: {}", id, e);
            throw new RuntimeException("Failed to find service", e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }

    public List<Service> findAll() {
        List<Service> services = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_ALL_SERVICES);
            rs = stmt.executeQuery();

            while (rs.next()) {
                services.add(mapResultSetToService(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding all services", e);
            throw new RuntimeException("Failed to find services", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return services;
    }

    public List<Service> findActiveServices() {
        List<Service> services = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_ACTIVE_SERVICES);
            rs = stmt.executeQuery();

            while (rs.next()) {
                services.add(mapResultSetToService(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding active services", e);
            throw new RuntimeException("Failed to find active services", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return services;
    }

    public List<Service> findByCategory(Service.Category category) {
        List<Service> services = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_SERVICES_BY_CATEGORY);
            setParameter(stmt, 1, category.name());
            rs = stmt.executeQuery();

            while (rs.next()) {
                services.add(mapResultSetToService(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding services by category: {}", category, e);
            throw new RuntimeException("Failed to find services by category", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return services;
    }

    public void deleteById(Long id) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(DELETE_SERVICE);
            setParameter(stmt, 1, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                logger.info("Service deleted with ID: {}", id);
            }

        } catch (SQLException e) {
            logger.error("Error deleting service with ID: {}", id, e);
            throw new RuntimeException("Failed to delete service", e);
        } finally {
            closeResources(conn, stmt);
        }
    }

    private Service mapResultSetToService(ResultSet rs) throws SQLException {
        Service service = new Service();

        service.setId(rs.getLong("id"));
        service.setName(rs.getString("name"));
        service.setDescription(rs.getString("description"));

        // Handle BigDecimal properly
        BigDecimal price = rs.getBigDecimal("price");
        if (price != null) {
            service.setPrice(price);
        } else {
            service.setPrice(new BigDecimal("0.00"));
        }

        service.setDurationMinutes(rs.getInt("duration_minutes"));

        String categoryStr = rs.getString("category");
        if (categoryStr != null) {
            try {
                service.setCategory(Service.Category.valueOf(categoryStr));
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid service category: {}", categoryStr);
                service.setCategory(null);
            }
        }

        service.setIsActive(rs.getInt("is_active") == 1);
        service.setCreatedAt(toLocalDateTime(rs.getTimestamp("created_at")));
        service.setUpdatedAt(toLocalDateTime(rs.getTimestamp("updated_at")));

        return service;
    }
}

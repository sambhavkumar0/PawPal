package com.pawpal.dao;

import com.pawpal.entity.User;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserDao extends BaseDao {

    private static final String INSERT_USER =
            "INSERT INTO users (first_name, last_name, email, password, phone_number, address, role, is_active, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_USER_BY_ID =
            "SELECT * FROM users WHERE id = ?";

    private static final String SELECT_USER_BY_EMAIL =
            "SELECT * FROM users WHERE email = ?";

    private static final String SELECT_ALL_USERS =
            "SELECT * FROM users ORDER BY created_at DESC";

    private static final String UPDATE_USER =
            "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ?, role = ?, is_active = ?, updated_at = ? WHERE id = ?";

    private static final String DELETE_USER =
            "DELETE FROM users WHERE id = ?";

    private static final String EXISTS_BY_EMAIL =
            "SELECT COUNT(*) FROM users WHERE email = ?";

    public User save(User user) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();

            if (user.getId() == null) {
                // Insert new user
                stmt = conn.prepareStatement(INSERT_USER, new String[]{"id"});
                setParameter(stmt, 1, user.getFirstName());
                setParameter(stmt, 2, user.getLastName());
                setParameter(stmt, 3, user.getEmail());
                setParameter(stmt, 4, user.getPassword());
                setParameter(stmt, 5, user.getPhoneNumber());
                setParameter(stmt, 6, user.getAddress());
                setParameter(stmt, 7, user.getRole().name());
                setParameter(stmt, 8, user.getIsActive() ? 1 : 0);
                setParameter(stmt, 9, toTimestamp(LocalDateTime.now()));
                setParameter(stmt, 10, toTimestamp(LocalDateTime.now()));

                int affectedRows = stmt.executeUpdate();
                if (affectedRows > 0) {
                    rs = stmt.getGeneratedKeys();
                    if (rs.next()) {
                        user.setId(rs.getLong(1));
                    }
                }
                logger.info("User created with ID: {}", user.getId());
            } else {
                // Update existing user
                stmt = conn.prepareStatement(UPDATE_USER);
                setParameter(stmt, 1, user.getFirstName());
                setParameter(stmt, 2, user.getLastName());
                setParameter(stmt, 3, user.getEmail());
                setParameter(stmt, 4, user.getPhoneNumber());
                setParameter(stmt, 5, user.getAddress());
                setParameter(stmt, 6, user.getRole().name());
                setParameter(stmt, 7, user.getIsActive() ? 1 : 0);
                setParameter(stmt, 8, toTimestamp(LocalDateTime.now()));
                setParameter(stmt, 9, user.getId());

                stmt.executeUpdate();
                logger.info("User updated with ID: {}", user.getId());
            }

            return user;

        } catch (SQLException e) {
            logger.error("Error saving user", e);
            throw new RuntimeException("Failed to save user", e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }

    public Optional<User> findById(Long id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_USER_BY_ID);
            setParameter(stmt, 1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return Optional.of(mapResultSetToUser(rs));
            }

            return Optional.empty();

        } catch (SQLException e) {
            logger.error("Error finding user by ID: {}", id, e);
            throw new RuntimeException("Failed to find user", e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }

    public Optional<User> findByEmail(String email) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_USER_BY_EMAIL);
            setParameter(stmt, 1, email);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return Optional.of(mapResultSetToUser(rs));
            }

            return Optional.empty();

        } catch (SQLException e) {
            logger.error("Error finding user by email: {}", email, e);
            throw new RuntimeException("Failed to find user", e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }

    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_ALL_USERS);
            rs = stmt.executeQuery();

            while (rs.next()) {
                users.add(mapResultSetToUser(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding all users", e);
            throw new RuntimeException("Failed to find users", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return users;
    }

    public boolean existsByEmail(String email) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(EXISTS_BY_EMAIL);
            setParameter(stmt, 1, email);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }

            return false;

        } catch (SQLException e) {
            logger.error("Error checking if user exists by email: {}", email, e);
            throw new RuntimeException("Failed to check user existence", e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }

    public void deleteById(Long id) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(DELETE_USER);
            setParameter(stmt, 1, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                logger.info("User deleted with ID: {}", id);
            }

        } catch (SQLException e) {
            logger.error("Error deleting user with ID: {}", id, e);
            throw new RuntimeException("Failed to delete user", e);
        } finally {
            closeResources(conn, stmt);
        }
    }

    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setFirstName(rs.getString("first_name"));
        user.setLastName(rs.getString("last_name"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setPhoneNumber(rs.getString("phone_number"));
        user.setAddress(rs.getString("address"));
        user.setRole(User.Role.valueOf(rs.getString("role")));
        user.setIsActive(rs.getInt("is_active") == 1);
        user.setCreatedAt(toLocalDateTime(rs.getTimestamp("created_at")));
        user.setUpdatedAt(toLocalDateTime(rs.getTimestamp("updated_at")));
        return user;
    }
}

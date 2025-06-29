package com.pawpal.dao;

import com.pawpal.entity.Pet;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class PetDao extends BaseDao {

    private static final String INSERT_PET =
            "INSERT INTO pets (name, species, breed, age, gender, date_of_birth, description, medical_notes, emergency_contact, is_active, created_at, updated_at, owner_id) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_PET_BY_ID =
            "SELECT * FROM pets WHERE id = ?";

    private static final String SELECT_PETS_BY_OWNER =
            "SELECT * FROM pets WHERE owner_id = ? AND is_active = 1 ORDER BY created_at DESC";

    private static final String SELECT_ALL_PETS =
            "SELECT * FROM pets ORDER BY created_at DESC";

    private static final String UPDATE_PET =
            "UPDATE pets SET name = ?, species = ?, breed = ?, age = ?, gender = ?, date_of_birth = ?, description = ?, medical_notes = ?, emergency_contact = ?, is_active = ?, updated_at = ? WHERE id = ?";

    private static final String DELETE_PET =
            "UPDATE pets SET is_active = 0, updated_at = ? WHERE id = ?";

    public Pet save(Pet pet) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();

            if (pet.getId() == null) {
                stmt = conn.prepareStatement(INSERT_PET, new String[]{"id"});
                setParameter(stmt, 1, pet.getName());
                setParameter(stmt, 2, pet.getSpecies());
                setParameter(stmt, 3, pet.getBreed());
                setParameter(stmt, 4, pet.getAge());
                setParameter(stmt, 5, pet.getGender() != null ? pet.getGender().name() : null);
                setParameter(stmt, 6, pet.getDateOfBirth() != null ? Date.valueOf(pet.getDateOfBirth()) : null);
                setParameter(stmt, 7, pet.getDescription());
                setParameter(stmt, 8, pet.getMedicalNotes());
                setParameter(stmt, 9, pet.getEmergencyContact());
                setParameter(stmt, 10, pet.getIsActive() ? 1 : 0);
                setParameter(stmt, 11, toTimestamp(LocalDateTime.now()));
                setParameter(stmt, 12, toTimestamp(LocalDateTime.now()));
                setParameter(stmt, 13, pet.getOwnerId());

                int affectedRows = stmt.executeUpdate();
                if (affectedRows > 0) {
                    rs = stmt.getGeneratedKeys();
                    if (rs.next()) {
                        pet.setId(rs.getLong(1));
                    }
                }
                logger.info("Pet created with ID: {}", pet.getId());
            } else {
                stmt = conn.prepareStatement(UPDATE_PET);
                setParameter(stmt, 1, pet.getName());
                setParameter(stmt, 2, pet.getSpecies());
                setParameter(stmt, 3, pet.getBreed());
                setParameter(stmt, 4, pet.getAge());
                setParameter(stmt, 5, pet.getGender() != null ? pet.getGender().name() : null);
                setParameter(stmt, 6, pet.getDateOfBirth() != null ? Date.valueOf(pet.getDateOfBirth()) : null);
                setParameter(stmt, 7, pet.getDescription());
                setParameter(stmt, 8, pet.getMedicalNotes());
                setParameter(stmt, 9, pet.getEmergencyContact());
                setParameter(stmt, 10, pet.getIsActive() ? 1 : 0);
                setParameter(stmt, 11, toTimestamp(LocalDateTime.now()));
                setParameter(stmt, 12, pet.getId());

                stmt.executeUpdate();
                logger.info("Pet updated with ID: {}", pet.getId());
            }

            return pet;

        } catch (SQLException e) {
            logger.error("Error saving pet", e);
            throw new RuntimeException("Failed to save pet", e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }

    public Optional<Pet> findById(Long id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_PET_BY_ID);
            setParameter(stmt, 1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return Optional.of(mapResultSetToPet(rs));
            }

            return Optional.empty();

        } catch (SQLException e) {
            logger.error("Error finding pet by ID: {}", id, e);
            throw new RuntimeException("Failed to find pet", e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }

    public List<Pet> findByOwnerId(Long ownerId) {
        List<Pet> pets = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_PETS_BY_OWNER);
            setParameter(stmt, 1, ownerId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                pets.add(mapResultSetToPet(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding pets by owner ID: {}", ownerId, e);
            throw new RuntimeException("Failed to find pets", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return pets;
    }

    public List<Pet> findAll() {
        List<Pet> pets = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(SELECT_ALL_PETS);
            rs = stmt.executeQuery();

            while (rs.next()) {
                pets.add(mapResultSetToPet(rs));
            }

        } catch (SQLException e) {
            logger.error("Error finding all pets", e);
            throw new RuntimeException("Failed to find pets", e);
        } finally {
            closeResources(conn, stmt, rs);
        }

        return pets;
    }

    public void deleteById(Long id) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = getConnection();
            stmt = conn.prepareStatement(DELETE_PET);
            setParameter(stmt, 1, toTimestamp(LocalDateTime.now()));
            setParameter(stmt, 2, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                logger.info("Pet soft deleted with ID: {}", id);
            }

        } catch (SQLException e) {
            logger.error("Error deleting pet with ID: {}", id, e);
            throw new RuntimeException("Failed to delete pet", e);
        } finally {
            closeResources(conn, stmt);
        }
    }

    private Pet mapResultSetToPet(ResultSet rs) throws SQLException {
        Pet pet = new Pet();

        pet.setId(rs.getLong("id"));
        pet.setName(rs.getString("name"));
        pet.setSpecies(rs.getString("species"));
        pet.setBreed(rs.getString("breed"));
        pet.setAge((Integer) rs.getObject("age"));

        String gender = rs.getString("gender");
        if (gender != null) {
            pet.setGender(Pet.Gender.valueOf(gender));
        }

        Date dateOfBirth = rs.getDate("date_of_birth");
        if (dateOfBirth != null) {
            pet.setDateOfBirth(dateOfBirth.toLocalDate());
        }

        pet.setDescription(rs.getString("description"));
        pet.setMedicalNotes(rs.getString("medical_notes"));
        pet.setEmergencyContact(rs.getString("emergency_contact"));
        pet.setIsActive(rs.getInt("is_active") == 1);
        pet.setCreatedAt(toLocalDateTime(rs.getTimestamp("created_at")));
        pet.setUpdatedAt(toLocalDateTime(rs.getTimestamp("updated_at")));
        pet.setOwnerId(rs.getLong("owner_id"));

        return pet;
    }
}

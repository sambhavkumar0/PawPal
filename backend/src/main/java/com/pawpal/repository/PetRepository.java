package com.pawpal.repository;

import com.pawpal.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    // Find all pets by owner's id
    List<Pet> findByOwner_Id(Long ownerId);

    // Find all active pets by owner's id
    List<Pet> findByOwner_IdAndIsActiveTrue(Long ownerId);

    // Find all pets by species, case insensitive
    List<Pet> findBySpeciesIgnoreCase(String species);

    // Find all active pets
    List<Pet> findByIsActiveTrue();

    // Custom query to find pets by owner id and name containing string, case insensitive
    @Query("SELECT p FROM Pet p WHERE p.owner.id = :ownerId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Pet> findByOwnerIdAndNameContainingIgnoreCase(@Param("ownerId") Long ownerId, @Param("name") String name);

    // Count of active pets by owner id
    @Query("SELECT COUNT(p) FROM Pet p WHERE p.owner.id = :ownerId AND p.isActive = true")
    Long countActiveByOwnerId(@Param("ownerId") Long ownerId);
}

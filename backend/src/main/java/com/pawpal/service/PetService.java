package com.pawpal.service;

import com.pawpal.entity.Pet;
import com.pawpal.entity.User;
import com.pawpal.repository.PetRepository;
import com.pawpal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    //    @Autowired
//    private PetRepository petRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    public Pet createPet(Pet pet, Long ownerId) {
//        User owner = new User();
//        owner.setId(ownerId);
//        pet.setOwner(owner);
//        return petRepository.save(pet);
//    }
    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserService userService;

    public Pet createPet(Pet pet, Long ownerId) {
        // Add owner if not already set
        if (pet.getOwner() == null) {
            User owner = userService.findById(ownerId);
            pet.setOwner(owner);
        }

        return petRepository.save(pet);
    }

    // FIXED method: changed findByOwnerIdAndIsActiveTrue -> findByOwner_IdAndIsActiveTrue
    public List<Pet> findActivePetsByOwner(Long ownerId) {
        return petRepository.findByOwner_IdAndIsActiveTrue(ownerId);
    }

    public Pet findById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with id " + id));
    }

    public Pet updatePet(Long id, Pet petDetails) {
        Pet existingPet = findById(id);
        existingPet.setName(petDetails.getName());
        existingPet.setSpecies(petDetails.getSpecies());
        existingPet.setBreed(petDetails.getBreed());
        existingPet.setAge(petDetails.getAge());
        existingPet.setGender(petDetails.getGender());
        existingPet.setDateOfBirth(petDetails.getDateOfBirth());
        existingPet.setDescription(petDetails.getDescription());
        existingPet.setMedicalNotes(petDetails.getMedicalNotes());
        existingPet.setEmergencyContact(petDetails.getEmergencyContact());
        return petRepository.save(existingPet);
    }

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }

    public List<Pet> findActivePets() {
        return petRepository.findByIsActiveTrue();
    }
}

package com.pawpal.controller;

import com.pawpal.entity.Pet;
import com.pawpal.entity.User;
import com.pawpal.service.PetService;
import com.pawpal.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private UserService userService;

    //    @PostMapping
//    @PreAuthorize("hasRole('CUSTOMER')")
//    public ResponseEntity<Pet> createPet(@Valid @RequestBody Pet pet, Authentication authentication) {
//        User currentUser = userService.findByEmail(authentication.getName());
//        Pet createdPet = petService.createPet(pet, currentUser.getId());
//        return ResponseEntity.ok(createdPet);
//    }
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Pet> createPet(@Valid @RequestBody Pet pet, Authentication authentication) {
        User currentUser = userService.findByEmail(authentication.getName());

        // ✅ Set the owner explicitly
        pet.setOwner(currentUser);

        Pet createdPet = petService.createPet(pet, currentUser.getId());
//        return ResponseEntity.ok(createdPet);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdPet);

    }

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Pet>> getUserPets(Authentication authentication) {
        User currentUser = userService.findByEmail(authentication.getName());
        List<Pet> pets = petService.findActivePetsByOwner(currentUser.getId());
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        Pet pet = petService.findById(id);
        return ResponseEntity.ok(pet);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Pet> updatePet(@PathVariable Long id, @Valid @RequestBody Pet petDetails, Authentication authentication) {
        Pet pet = petService.findById(id);
        User currentUser = userService.findByEmail(authentication.getName());

        // Verify that the pet belongs to the current user
        if (!pet.getOwner().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Pet updatedPet = petService.updatePet(id, petDetails);
        return ResponseEntity.ok(updatedPet);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> deletePet(@PathVariable Long id, Authentication authentication) {
        Pet pet = petService.findById(id);
        User currentUser = userService.findByEmail(authentication.getName());

        // Verify that the pet belongs to the current user
        if (!pet.getOwner().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        petService.deletePet(id);
        return ResponseEntity.ok(new MessageResponse("Pet deleted successfully!"));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<List<Pet>> getAllPets() {
        List<Pet> pets = petService.findActivePets();
        return ResponseEntity.ok(pets);
    }

    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}

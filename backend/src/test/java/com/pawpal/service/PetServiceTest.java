package com.pawpal.service;

import com.pawpal.entity.Pet;
import com.pawpal.entity.User;
import com.pawpal.exception.ResourceNotFoundException;
import com.pawpal.repository.PetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @Mock
    private PetRepository petRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private PetService petService;

    private Pet testPet;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("john.doe@email.com");

        testPet = new Pet();
        testPet.setId(1L);
        testPet.setName("Buddy");
        testPet.setSpecies("Dog");
        testPet.setBreed("Golden Retriever");
        testPet.setAge(3);
        testPet.setOwner(testUser);
        testPet.setIsActive(true);
    }

    @Test
    void createPet_Success() {
        when(userService.findById(anyLong())).thenReturn(testUser);
        when(petRepository.save(any(Pet.class))).thenReturn(testPet);

        Pet result = petService.createPet(testPet, 1L);

        assertNotNull(result);
        assertEquals("Buddy", result.getName());
        assertEquals(testUser, result.getOwner());
        verify(petRepository).save(any(Pet.class));
    }

    @Test
    void findById_Success() {
        when(petRepository.findById(anyLong())).thenReturn(Optional.of(testPet));

        Pet result = petService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Buddy", result.getName());
    }

    @Test
    void findById_NotFound() {
        when(petRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            petService.findById(999L);
        });
    }

    @Test
    void findPetsByOwner_Success() {
        List<Pet> pets = Arrays.asList(testPet);
        when(petRepository.findByOwnerId(anyLong())).thenReturn(pets);

        List<Pet> result = petService.findPetsByOwner(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Buddy", result.get(0).getName());
    }

    @Test
    void updatePet_Success() {
        Pet updatedDetails = new Pet();
        updatedDetails.setName("Max");
        updatedDetails.setAge(4);

        when(petRepository.findById(anyLong())).thenReturn(Optional.of(testPet));
        when(petRepository.save(any(Pet.class))).thenReturn(testPet);

        Pet result = petService.updatePet(1L, updatedDetails);

        assertNotNull(result);
        verify(petRepository).save(any(Pet.class));
    }

    @Test
    void deletePet_Success() {
        when(petRepository.findById(anyLong())).thenReturn(Optional.of(testPet));
        when(petRepository.save(any(Pet.class))).thenReturn(testPet);

        petService.deletePet(1L);

        verify(petRepository).save(any(Pet.class));
    }
}

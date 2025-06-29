package com.pawpal.repository;

import com.pawpal.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john.doe@email.com");
        testUser.setPassword("password123");
        testUser.setRole(User.Role.CUSTOMER);
        testUser.setIsActive(true);
    }

    @Test
    void findByEmail_Success() {
        entityManager.persistAndFlush(testUser);

        Optional<User> found = userRepository.findByEmail("john.doe@email.com");

        assertTrue(found.isPresent());
        assertEquals("John", found.get().getFirstName());
        assertEquals("john.doe@email.com", found.get().getEmail());
    }

    @Test
    void findByEmail_NotFound() {
        Optional<User> found = userRepository.findByEmail("nonexistent@email.com");

        assertFalse(found.isPresent());
    }

    @Test
    void existsByEmail_True() {
        entityManager.persistAndFlush(testUser);

        boolean exists = userRepository.existsByEmail("john.doe@email.com");

        assertTrue(exists);
    }

    @Test
    void existsByEmail_False() {
        boolean exists = userRepository.existsByEmail("nonexistent@email.com");

        assertFalse(exists);
    }

    @Test
    void findByRole_Success() {
        entityManager.persistAndFlush(testUser);

        List<User> customers = userRepository.findByRole(User.Role.CUSTOMER);

        assertEquals(1, customers.size());
        assertEquals("John", customers.get(0).getFirstName());
    }

    @Test
    void findByIsActiveTrue_Success() {
        testUser.setIsActive(true);
        entityManager.persistAndFlush(testUser);

        User inactiveUser = new User();
        inactiveUser.setFirstName("Jane");
        inactiveUser.setLastName("Smith");
        inactiveUser.setEmail("jane.smith@email.com");
        inactiveUser.setPassword("password123");
        inactiveUser.setRole(User.Role.CUSTOMER);
        inactiveUser.setIsActive(false);
        entityManager.persistAndFlush(inactiveUser);

        List<User> activeUsers = userRepository.findByIsActiveTrue();

        assertEquals(1, activeUsers.size());
        assertEquals("John", activeUsers.get(0).getFirstName());
    }
}

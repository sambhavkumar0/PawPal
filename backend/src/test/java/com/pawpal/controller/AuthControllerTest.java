package com.pawpal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pawpal.dto.LoginDto;
import com.pawpal.dto.UserRegistrationDto;
import com.pawpal.entity.User;
import com.pawpal.security.JwtUtils;
import com.pawpal.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private LoginDto loginDto;
    private UserRegistrationDto registrationDto;
    private User testUser;

    @BeforeEach
    void setUp() {
        loginDto = new LoginDto();
        loginDto.setEmail("john.doe@email.com");
        loginDto.setPassword("password123");

        registrationDto = new UserRegistrationDto();
        registrationDto.setFirstName("John");
        registrationDto.setLastName("Doe");
        registrationDto.setEmail("john.doe@email.com");
        registrationDto.setPassword("password123");

        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john.doe@email.com");
        testUser.setRole(User.Role.CUSTOMER);
    }

    @Test
    @WithMockUser
    void signin_Success() throws Exception {
        Authentication authentication = new UsernamePasswordAuthenticationToken(testUser, null, testUser.getAuthorities());
        
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(jwtUtils.generateJwtToken(any())).thenReturn("jwt-token");

        mockMvc.perform(post("/auth/signin")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.email").value("john.doe@email.com"));
    }

    @Test
    @WithMockUser
    void signup_Success() throws Exception {
        when(userService.existsByEmail(anyString())).thenReturn(false);
        when(userService.registerUser(any())).thenReturn(testUser);

        mockMvc.perform(post("/auth/signup")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    @WithMockUser
    void signup_EmailAlreadyExists() throws Exception {
        when(userService.existsByEmail(anyString())).thenReturn(true);

        mockMvc.perform(post("/auth/signup")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already in use!"));
    }
}

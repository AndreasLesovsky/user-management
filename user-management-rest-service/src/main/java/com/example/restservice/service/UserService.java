package com.example.restservice.service;

import com.example.restservice.dto.UserInputDto;
import com.example.restservice.dto.UserOutputDto;
import com.example.restservice.entity.User;
import com.example.restservice.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.restservice.exception.UsernameAlreadyExistsException;
import com.example.restservice.exception.EmailAlreadyExistsException;
import com.example.restservice.exception.EntityNotFoundException;
import com.example.restservice.exception.JwtAuthException;
import com.example.restservice.exception.ValidationException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 🔹 CREATE
    public User createUser(UserInputDto input) {
    validateUserInput(input);

    if (userRepository.existsByEmail(input.getEmail())) {
        throw new EmailAlreadyExistsException();
    }

    if (userRepository.existsByName(input.getName())) {
        throw new UsernameAlreadyExistsException();
    }

    User user = new User();
    user.setName(input.getName());
    user.setEmail(input.getEmail());
    user.setPasswordHash(passwordEncoder.encode(input.getPassword()));
    return userRepository.save(user);
    }

    // 🔹 READ
    public List<UserOutputDto> getAllUsersDto() {
        return userRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public UserOutputDto getUserById(Long id) {
    return userRepository.findById(id)
            .map(this::toDto)
            .orElseThrow(EntityNotFoundException::new);
    }

    // 🔹 UPDATE
    public UserOutputDto updateUser(Long id, UserInputDto input) {
        validateUserInput(input);

        return userRepository.findById(id).map(user -> {
            user.setName(input.getName());
            user.setEmail(input.getEmail());
            if (input.getPassword() != null && !input.getPassword().isBlank()) {
                user.setPasswordHash(passwordEncoder.encode(input.getPassword()));
            }
            User updated = userRepository.save(user);
            return toDto(updated);
        }).orElse(null);
    }

    // 🔹 DELETE
    public boolean deleteUser(Long id, Long currentUserId) {
    if (id.equals(currentUserId)) {
        throw new com.example.restservice.exception.CannotDeleteSelfException();
    }
    if (userRepository.existsById(id)) {
        userRepository.deleteById(id);
        return true;
    }
    return false;
}
    // 🔹 Helper
    private UserOutputDto toDto(User user) {
        UserOutputDto dto = new UserOutputDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    private void validateUserInput(UserInputDto input) {
    // Name prüfen
    if (input.getName() == null || input.getName().isBlank()
        || input.getName().length() > 30
        || !input.getName().matches("^[A-Za-z]+( [A-Za-z]+)?$")) {
        throw new ValidationException();
    }

    // Email prüfen
    if (input.getEmail() == null || input.getEmail().isBlank()
        || !input.getEmail().matches("^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,6}$")) {
        throw new ValidationException();
    }

    // Passwort prüfen
    if (input.getPassword() != null && input.getPassword().length() < 8) {
        throw new ValidationException();
    }
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(EntityNotFoundException::new);
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new JwtAuthException();
        }
        return user;
    }

}

package com.example.restservice.controller;

import com.example.restservice.dto.LoginRequestDto;
import com.example.restservice.dto.LoginResponseDto;
import com.example.restservice.dto.UserOutputDto;
import com.example.restservice.dto.UserWithTokenDto;
import com.example.restservice.entity.User;
import com.example.restservice.exception.JwtAuthException;
import com.example.restservice.security.JwtUtil;
import com.example.restservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
        User user = userService.authenticate(request.getEmail(), request.getPassword());
        String token = jwtUtil.generateToken(user.getId());
        return ResponseEntity.ok(new LoginResponseDto(token));
    }

    @GetMapping("/check")
    public ResponseEntity<UserWithTokenDto> check(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new JwtAuthException();
        }

        Object principal = authentication.getPrincipal();
        Long userId;

        if (principal instanceof Long) {
            userId = (Long) principal;
        } else {
            try {
                userId = Long.parseLong(principal.toString());
            } catch (NumberFormatException e) {
                throw new JwtAuthException();
            }
        }

        UserOutputDto userDto = userService.getUserById(userId);
        String newToken = jwtUtil.generateToken(userId);

        UserWithTokenDto response = new UserWithTokenDto(
                userDto.getId(),
                userDto.getName(),
                userDto.getEmail(),
                newToken);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Stateless JWT: Logout ist clientseitig. Gibt 200 OK zurück.
        return ResponseEntity.ok().build();
    }
}

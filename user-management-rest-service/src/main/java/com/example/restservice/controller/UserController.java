package com.example.restservice.controller;

import com.example.restservice.dto.UserInputDto;
import com.example.restservice.dto.UserOutputDto;
import com.example.restservice.entity.User;
import com.example.restservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // CREATE
    @PostMapping
    public UserOutputDto createUser(@RequestBody UserInputDto input) {
        User user = userService.createUser(input);
        return new UserOutputDto() {
            {
                setId(user.getId());
                setName(user.getName());
                setEmail(user.getEmail());
                setCreatedAt(user.getCreatedAt());
                setUpdatedAt(user.getUpdatedAt());
            }
        };
    }

    // READ ALL
    @GetMapping
    public List<UserOutputDto> getAllUsers() {
        return userService.getAllUsersDto();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public UserOutputDto getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public UserOutputDto updateUser(@PathVariable Long id, @RequestBody UserInputDto input) {
        return userService.updateUser(id, input);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = null;
        if (auth != null && auth.getPrincipal() != null) {
            currentUserId = Long.parseLong(auth.getPrincipal().toString());
        }
        userService.deleteUser(id, currentUserId);
        return ResponseEntity.noContent().build(); // 204 No Content bei Erfolg
    }
}

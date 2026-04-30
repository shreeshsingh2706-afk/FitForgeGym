package com.fitforge.service;

import com.fitforge.model.User;
import com.fitforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * UserService - Business logic layer
 * Controller calls Service → Service calls Repository → Repository talks to DB
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Get all registered users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Register a new user
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // Count total members
    public long getMemberCount() {
        return userRepository.count();
    }
}

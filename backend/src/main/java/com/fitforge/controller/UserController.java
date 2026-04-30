package com.fitforge.controller;

import com.fitforge.model.User;
import com.fitforge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * UserController - Exposes REST API endpoints
 *
 * Base URL: http://localhost:8080/api
 *
 * Endpoints:
 *   GET  /api/hello       → Health check / welcome message
 *   GET  /api/users       → Get all registered members
 *   POST /api/users       → Register a new member
 *   GET  /api/users/{id}  → Get a specific member
 *   GET  /api/stats       → Get gym statistics
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://your-aws-domain.com"})
public class UserController {

    @Autowired
    private UserService userService;

    // ─────────────────────────────────────────────
    // GET /api/hello
    // Simple health check - test if backend is running
    // ─────────────────────────────────────────────
    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to FitForge API! 💪");
        response.put("status", "running");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────────
    // GET /api/users
    // Returns list of all registered gym members
    // ─────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // ─────────────────────────────────────────────
    // POST /api/users
    // Register a new gym member
    // Request body: { "name": "John", "email": "john@gmail.com", "plan": "Basic" }
    // ─────────────────────────────────────────────
    @PostMapping("/users")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Welcome to FitForge, " + savedUser.getName() + "! 🎉");
            response.put("user", savedUser);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // ─────────────────────────────────────────────
    // GET /api/users/{id}
    // Get a specific member by their ID
    // ─────────────────────────────────────────────
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // ─────────────────────────────────────────────
    // GET /api/stats
    // Returns gym statistics (total members, plans etc.)
    // ─────────────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMembers", userService.getMemberCount());
        stats.put("gymName", "FitForge Gym");
        stats.put("plans", List.of("Basic - ₹999/mo", "Pro - ₹1999/mo", "Elite - ₹2999/mo"));
        return ResponseEntity.ok(stats);
    }
}

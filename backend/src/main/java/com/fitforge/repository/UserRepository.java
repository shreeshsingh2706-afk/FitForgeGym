package com.fitforge.repository;

import com.fitforge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * UserRepository - Handles all database operations for User
 *
 * By extending JpaRepository, Spring automatically provides:
 *   - findAll()       → SELECT * FROM users
 *   - findById(id)    → SELECT * FROM users WHERE id = ?
 *   - save(user)      → INSERT or UPDATE
 *   - deleteById(id)  → DELETE FROM users WHERE id = ?
 *
 * No SQL needed! Spring Data JPA handles everything.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom query: find user by email
    // Spring generates: SELECT * FROM users WHERE email = ?
    boolean existsByEmail(String email);
}

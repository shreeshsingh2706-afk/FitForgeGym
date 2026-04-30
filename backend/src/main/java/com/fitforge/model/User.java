package com.fitforge.model;

import jakarta.persistence.*;

/**
 * User Entity - Maps to the 'users' table in MySQL
 * Columns: id (auto-generated), name, email, plan
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String plan;  // "Basic", "Pro", "Elite"

    // ── No-arg constructor (required by JPA) ──
    public User() {}

    // ── All-arg constructor ──
    public User(Long id, String name, String email, String plan) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.plan = plan;
    }

    // ── Getters ──
    public Long getId()     { return id; }
    public String getName() { return name; }
    public String getEmail(){ return email; }
    public String getPlan() { return plan; }

    // ── Setters ──
    public void setId(Long id)        { this.id = id; }
    public void setName(String name)  { this.name = name; }
    public void setEmail(String email){ this.email = email; }
    public void setPlan(String plan)  { this.plan = plan; }

    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "', email='" + email + "', plan='" + plan + "'}";
    }
}

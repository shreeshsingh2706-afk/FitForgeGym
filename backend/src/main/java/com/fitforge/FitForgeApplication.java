package com.fitforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * FitForge Backend - Main Entry Point
 * Run this class to start the Spring Boot server on port 8080
 */
@SpringBootApplication
public class FitForgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitForgeApplication.class, args);
        System.out.println("✅ FitForge Backend is running at http://localhost:8080");
    }
}

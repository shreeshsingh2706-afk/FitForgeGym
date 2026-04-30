-- ============================================
-- FitForge MySQL Setup Script
-- Run this ONCE before starting the backend
-- ============================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS fitforge_db;
USE fitforge_db;

-- Step 2: Create a dedicated user (safer than using root)
CREATE USER IF NOT EXISTS 'fitforge_user'@'localhost' IDENTIFIED BY 'fitforge_pass';
GRANT ALL PRIVILEGES ON fitforge_db.* TO 'fitforge_user'@'localhost';
FLUSH PRIVILEGES;

-- Step 3: Create the users table
-- (Spring Boot will auto-create this via JPA, but you can also run it manually)
CREATE TABLE IF NOT EXISTS users (
    id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    plan  VARCHAR(50)  NOT NULL
);

-- Step 4: Insert sample data (optional)
INSERT IGNORE INTO users (name, email, plan) VALUES
    ('Shreesh Kumar', 'shreesh@example.com', 'Elite'),
    ('Kaustubh Desale', 'kaustubh@example.com', 'Pro'),
    ('Sahil Thorat', 'sahil@example.com', 'Basic');

-- Verify
SELECT * FROM users;

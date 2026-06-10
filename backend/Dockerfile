# ============================================
# FitForge Backend — Dockerfile
# Multi-stage build: Build with Maven, Run with JRE
# ============================================

# Stage 1: Build the JAR using Maven
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies first (layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run with lightweight JRE (smaller image)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from Stage 1
COPY --from=build /app/target/fitforge-backend-1.0.0.jar app.jar

# Expose port (Render injects PORT env var)
EXPOSE 8080

# Start the Spring Boot app with memory limits for Render free tier (512MB)
ENTRYPOINT ["java", "-Xmx256m", "-Xms128m", "-XX:+UseSerialGC", "-jar", "app.jar"]

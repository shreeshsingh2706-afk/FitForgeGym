// ============================================
// src/services/api.js
// Central file for all backend API calls
// ============================================

// Change this to your AWS server IP/domain in production
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

/**
 * Health check - test if backend is running
 * GET /api/hello
 */
export const checkHealth = async () => {
  const res = await fetch(`${BASE_URL}/hello`);
  if (!res.ok) throw new Error("Backend not reachable");
  return res.json();
};

/**
 * Get all registered gym members
 * GET /api/users
 */
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

/**
 * Register a new gym member
 * POST /api/users
 * @param {Object} userData - { name, email, plan }
 */
export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
};

/**
 * Get gym statistics
 * GET /api/stats
 */
export const getStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

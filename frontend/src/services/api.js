// ============================================
// src/services/api.js
// Central file for all backend API calls
// Falls back to localStorage mock when no backend is deployed
// ============================================

const BASE_URL = process.env.REACT_APP_API_URL; // undefined = use mock

// ── LocalStorage Mock Helpers ────────────────────────────────────────────────
const LS_KEY = "fitforge_members";

const getMockUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveMockUsers = (users) => {
  localStorage.setItem(LS_KEY, JSON.stringify(users));
};

// ── API Functions ────────────────────────────────────────────────────────────

/**
 * Health check - test if backend is running
 * GET /api/hello
 */
export const checkHealth = async () => {
  if (!BASE_URL) return { status: "mock" };
  const res = await fetch(`${BASE_URL}/hello`);
  if (!res.ok) throw new Error("Backend not reachable");
  return res.json();
};

/**
 * Get all registered gym members
 * GET /api/users
 */
export const getUsers = async () => {
  if (!BASE_URL) return getMockUsers();
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
  if (!BASE_URL) {
    const users = getMockUsers();
    // Check for duplicate email
    if (users.find((u) => u.email === userData.email)) {
      throw new Error("Email already registered!");
    }
    const newUser = { id: Date.now(), ...userData };
    saveMockUsers([...users, newUser]);
    return { message: `✅ Welcome to FitForge, ${userData.name}! You're on the ${userData.plan} plan.` };
  }
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
  if (!BASE_URL) {
    const users = getMockUsers();
    return { totalMembers: users.length };
  }
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};


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

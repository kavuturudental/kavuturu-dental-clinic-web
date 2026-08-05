// src/services/authService.js

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================================================
   Request Interceptor
========================================================== */

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ==========================================================
   Auth Service
========================================================== */

const authService = {
  /**
   * Login strictly via POST /api/auth/login
   */
  async login(email, password) {
    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const payload = response.data?.data || response.data;
      const { token, user } = payload || {};

      if (!token || !user || !user.role) {
        throw new Error("Invalid response from server. Authentication failed.");
      }

      // Clear any prior state first
      this.logout();

      // Store authentic credentials
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const normalizedRole = user.role.toLowerCase();
      if (normalizedRole === "doctor") {
        localStorage.setItem("doctorAuth", "true");
      } else if (normalizedRole === "receptionist") {
        localStorage.setItem("receptionistAuth", "true");
      }

      return user;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  /**
   * Logout: remove all auth storage items
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("doctorAuth");
    localStorage.removeItem("receptionistAuth");
  },

  /**
   * Get Current User Object
   */
  getUser() {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get Token
   */
  getToken() {
    return localStorage.getItem("token");
  },

  /**
   * Check if user is authenticated (JWT token exists and user exists)
   */
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return Boolean(token && user && user.role);
  },

  /**
   * Check if user has specific required role (case-insensitive)
   */
  hasRole(requiredRole) {
    if (!this.isAuthenticated()) return false;
    const user = this.getUser();
    return user?.role?.toLowerCase() === requiredRole.toLowerCase();
  },

  /**
   * Check if authenticated user is a doctor
   */
  isDoctor() {
    return this.hasRole("doctor");
  },

  /**
   * Check if authenticated user is a receptionist
   */
  isReceptionist() {
    return this.hasRole("receptionist");
  },

  /**
   * Request password reset email link
   */
  async forgotPassword(email) {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  },

  /**
   * Verify reset token status
   */
  async verifyResetToken(token) {
    const response = await API.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(token, password, confirmPassword) {
    const response = await API.post(`/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * Update logged-in user profile (Doctor or Receptionist)
   */
  async updateProfile(data) {
    const response = await API.put("/auth/profile", data);
    return response.data;
  },

  /**
   * Fetch authenticated user profile from backend (single source of truth)
   */
  async getProfile() {
    const response = await API.get("/auth/profile");
    return response.data;
  },
};

export default authService;
// src/services/authService.js

import api from "./api";

/* ==========================================================
   Auth Service (Doctor CMS Only)
========================================================== */

const authService = {
  /**
   * Login strictly via POST /api/auth/login
   */
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", {
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
      localStorage.setItem("doctorAuth", "true");

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
  hasRole(requiredRole = "doctor") {
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
   * Request password reset email link
   */
  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  /**
   * Verify reset token status
   */
  async verifyResetToken(token) {
    const response = await api.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(token, password, confirmPassword) {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * Update logged-in user profile
   */
  async updateProfile(data) {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  /**
   * Fetch authenticated user profile from backend (single source of truth)
   */
  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

export default authService;
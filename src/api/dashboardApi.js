// src/api/dashboardApi.js

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get Shared Dashboard & Appointment Summary Metrics
 * GET /api/dashboard/appointment-summary
 */
export const getDashboardSummaryMetrics = async () => {
  try {
    const response = await API.get("/dashboard/appointment-summary");
    return response.data;
  } catch (err) {
    try {
      const response = await API.get("/dashboard/summary");
      return response.data;
    } catch (fallbackErr) {
      console.error("Failed to fetch dashboard summary metrics:", fallbackErr);
      throw fallbackErr;
    }
  }
};

// src/api/insightsApi.js

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
 * Get Comprehensive Analytics Insights
 * GET /api/dashboard/insights (Fallback: /api/doctor/appointment-management/insights)
 */
export const getInsightsData = async (params = {}) => {
  try {
    const response = await API.get("/dashboard/insights", { params });
    return response.data;
  } catch (err) {
    try {
      const response = await API.get("/doctor/appointment-management/insights", { params });
      return response.data;
    } catch (fallbackErr) {
      console.error("Failed to fetch insights analytics:", fallbackErr);
      throw fallbackErr;
    }
  }
};

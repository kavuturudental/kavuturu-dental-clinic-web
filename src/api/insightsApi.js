// src/api/insightsApi.js

import api from "../services/api";

/**
 * Get Comprehensive Analytics Insights
 * GET /api/dashboard/insights (Fallback: /api/doctor/appointment-management/insights)
 */
export const getInsightsData = async (params = {}) => {
  try {
    const response = await api.get("/dashboard/insights", { params });
    return response.data;
  } catch (err) {
    try {
      const response = await api.get("/doctor/appointment-management/insights", { params });
      return response.data;
    } catch (fallbackErr) {
      console.error("Failed to fetch insights analytics:", fallbackErr);
      throw fallbackErr;
    }
  }
};

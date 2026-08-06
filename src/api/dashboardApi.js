// src/api/dashboardApi.js

import api from "../services/api";

/**
 * Get Shared Dashboard & Appointment Summary Metrics
 * GET /api/dashboard/appointment-summary
 */
export const getDashboardSummaryMetrics = async () => {
  try {
    const response = await api.get("/dashboard/appointment-summary");
    return response.data;
  } catch (err) {
    try {
      const response = await api.get("/dashboard/summary");
      return response.data;
    } catch (fallbackErr) {
      console.error("Failed to fetch dashboard summary metrics:", fallbackErr);
      throw fallbackErr;
    }
  }
};

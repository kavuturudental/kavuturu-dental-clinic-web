// src/services/dashboardService.js

import appointmentManagementService from "./appointmentManagementService";

export const dashboardService = {
  getSummaryStats: () => appointmentManagementService.getSummaryStats(),
  getInsightsData: () => appointmentManagementService.getInsightsData()
};

export default dashboardService;

// src/receptionist/components/dashboard/SummaryCards.jsx

import React from "react";
import DashboardSummaryCards from "../../common/DashboardSummaryCards";

export default function SummaryCards({ stats }) {
  // If legacy stats object passed (todayTotal, pending, confirmed, completed), map to summaryData format
  const summaryData = stats
    ? {
        totalVisits: stats.totalVisits ?? stats.confirmed + stats.completed,
        todaysSchedule: stats.todaysSchedule ?? stats.todayTotal,
        pendingApprovals: stats.pendingApprovals ?? stats.pending,
        completedVisits: stats.completedVisits ?? stats.completed
      }
    : null;

  return <DashboardSummaryCards summaryData={summaryData} />;
}

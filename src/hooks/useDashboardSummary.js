// src/hooks/useDashboardSummary.js

import { useState, useEffect, useCallback } from "react";
import { getDashboardSummaryMetrics } from "../api/dashboardApi";
import eventBus from "../utils/eventBus";

export default function useDashboardSummary(pollIntervalMs = 4000) {
  const [summary, setSummary] = useState({
    todaysSchedule: 0,
    upcomingAppointments: 0,
    pendingRequests: 0,
    pendingApprovals: 0,
    totalVisits: 0,
    completedVisits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = useCallback(async () => {
    try {
      const data = await getDashboardSummaryMetrics();
      if (data && (data.todaysSchedule !== undefined || data.totalVisits !== undefined || data.pendingRequests !== undefined)) {
        setSummary({
          todaysAppointments: data.todaysAppointments ?? data.todaysSchedule ?? 0,
          todaysSchedule: data.todaysSchedule ?? data.todaysAppointments ?? 0,
          upcomingAppointments: data.upcomingAppointments ?? 0,
          pendingRequests: data.pendingRequests ?? data.pendingApprovals ?? 0,
          pendingApprovals: data.pendingApprovals ?? data.pendingRequests ?? 0,
          nextAppointment: data.nextAppointment ?? null,
          remainingToday: data.remainingToday ?? 0,
          totalVisits: data.totalVisits ?? 0,
          completedVisits: data.completedVisits ?? 0,
        });
      }
      setError("");
    } catch (err) {
      console.error("useDashboardSummary error:", err);
      setError("Failed to sync dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();

    const unsubscribe = eventBus.on("STATE_UPDATED", fetchSummary);

    let intervalId;
    if (pollIntervalMs > 0) {
      intervalId = setInterval(fetchSummary, pollIntervalMs);
    }

    return () => {
      unsubscribe();
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchSummary, pollIntervalMs]);

  return { summary, loading, error, refetch: fetchSummary };
}

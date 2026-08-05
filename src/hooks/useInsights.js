// src/hooks/useInsights.js

import { useState, useEffect, useCallback } from "react";
import { getInsightsData } from "../api/insightsApi";

export default function useInsights(filterRange = "This Month", customRange = {}, trendMonths = 6) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const params = { range: filterRange, trendMonths };
      if (filterRange === "Custom" && customRange.startDate && customRange.endDate) {
        params.startDate = customRange.startDate;
        params.endDate = customRange.endDate;
      }

      const res = await getInsightsData(params);
      if (res && res.patientInsights) {
        setData(res);
      } else if (res && res.data) {
        setData(res.data);
      }
      setError("");
    } catch (err) {
      console.error("useInsights error:", err);
      setError(err.response?.data?.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, [filterRange, customRange.startDate, customRange.endDate, trendMonths]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { data, loading, error, refetch: fetchInsights };
}

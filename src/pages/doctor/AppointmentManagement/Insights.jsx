// src/pages/doctor/AppointmentManagement/Insights.jsx

import React, { useState, useMemo } from "react";
import FilterToolbar from "../../../components/doctor/insights/FilterToolbar";
import DoctorInsightCards from "../../../components/doctor/insights/DoctorInsightCards";
import MonthlyTrendChart from "../../../components/doctor/insights/MonthlyTrendChart";
import TreatmentBarChart from "../../../components/doctor/insights/TreatmentBarChart";
import StatusDoughnutChart from "../../../components/doctor/insights/StatusDoughnutChart";
import WeeklyActivityChart from "../../../components/doctor/insights/WeeklyActivityChart";
import NewVsReturningChart from "../../../components/doctor/insights/NewVsReturningChart";
import EmptyState from "../../../components/receptionist/common/EmptyState";
import useAppointments from "../../../hooks/useAppointments";
import usePatients from "../../../hooks/usePatients";
import { BarChart2 } from "lucide-react";

const getLocalDateString = (d = new Date()) => {
  const dateObj = new Date(d);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Insights() {
  const { appointments: rawAppointments, loading: loadingApts, fetchAppointments } = useAppointments();
  const { patients: rawPatients, loading: loadingPatients, fetchPatients } = usePatients();

  const [activeRange, setActiveRange] = useState("This Month");
  const [customRange, setCustomRange] = useState({ startDate: "", endDate: "" });
  const [monthlyTrendYearFilter, setMonthlyTrendYearFilter] = useState("This Year");
  const [newVsReturningYearFilter, setNewVsReturningYearFilter] = useState("This Year");

  const handleCustomRangeChange = (field, val) => {
    setCustomRange((prev) => ({ ...prev, [field]: val }));
  };

  const handleRefresh = () => {
    fetchAppointments();
    fetchPatients();
  };

  const isLoading = loadingApts || loadingPatients;

  // Analytics Computation Pipeline
  const analyticsData = useMemo(() => {
    const apts = Array.isArray(rawAppointments) ? rawAppointments.filter((a) => a.status !== "Rejected") : [];
    const pts = Array.isArray(rawPatients) ? rawPatients : [];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Compute Date Boundaries based on activeRange
    let rangeStart = "";
    let rangeEnd = "";

    const todayStr = getLocalDateString(now);

    if (activeRange === "Today") {
      rangeStart = todayStr;
      rangeEnd = todayStr;
    } else if (activeRange === "This Week") {
      const dayOfWeek = now.getDay();
      const distToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const mon = new Date(now);
      mon.setDate(now.getDate() - distToMon);
      rangeStart = getLocalDateString(mon);
      rangeEnd = todayStr;
    } else if (activeRange === "This Month") {
      rangeStart = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
      rangeEnd = todayStr;
    } else if (activeRange === "Last Month") {
      const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const prevYear = prevMonthDate.getFullYear();
      const prevMonth = prevMonthDate.getMonth();
      const lastDayPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

      rangeStart = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-01`;
      rangeEnd = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(lastDayPrevMonth).padStart(2, "0")}`;
    } else if (activeRange === "This Year") {
      rangeStart = `${currentYear}-01-01`;
      rangeEnd = `${currentYear}-12-31`;
    } else if (activeRange === "Last Year") {
      rangeStart = `${currentYear - 1}-01-01`;
      rangeEnd = `${currentYear - 1}-12-31`;
    } else if (activeRange === "Custom" && customRange.startDate) {
      rangeStart = customRange.startDate;
      rangeEnd = customRange.endDate || todayStr;
    }

    // Filter appointments for active range
    const filteredApts = apts.filter((a) => {
      const dateStr = (a.appointmentDate || a.date || "").slice(0, 10);
      if (!dateStr) return true;
      if (rangeStart && dateStr < rangeStart) return false;
      if (rangeEnd && dateStr > rangeEnd) return false;
      return true;
    });

    // 1. Total Patients Metrics
    const totalPatientsCount = pts.length;
    const thisMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthPrefix = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, "0")}`;

    const thisMonthNewPatients = pts.filter((p) => (p.firstVisitDate || p.createdAt || "").startsWith(thisMonthPrefix)).length;
    const lastMonthNewPatients = pts.filter((p) => (p.firstVisitDate || p.createdAt || "").startsWith(lastMonthPrefix)).length;
    const totalPatientsTrend = lastMonthNewPatients > 0
      ? Math.round(((thisMonthNewPatients - lastMonthNewPatients) / lastMonthNewPatients) * 100)
      : (thisMonthNewPatients > 0 ? 100 : 0);

    // 2. Total Appointments Metrics
    const totalAppointmentsCount = filteredApts.length;
    const thisMonthAptsCount = apts.filter((a) => (a.appointmentDate || a.date || "").startsWith(thisMonthPrefix)).length;
    const lastMonthAptsCount = apts.filter((a) => (a.appointmentDate || a.date || "").startsWith(lastMonthPrefix)).length;
    const totalAppointmentsTrend = lastMonthAptsCount > 0
      ? Math.round(((thisMonthAptsCount - lastMonthAptsCount) / lastMonthAptsCount) * 100)
      : (thisMonthAptsCount > 0 ? 100 : 0);

    // 3. Completed Treatments Metrics
    const completedApts = filteredApts.filter((a) => a.status === "Completed");
    const completedTreatmentsCount = completedApts.length;
    const completionRate = totalAppointmentsCount > 0
      ? Math.round((completedTreatmentsCount / totalAppointmentsCount) * 100)
      : 0;

    // 4. Most Popular Treatment Metrics
    const treatmentCounts = {};
    const sourceAptsForTreatment = completedApts.length > 0 ? completedApts : filteredApts;
    sourceAptsForTreatment.forEach((a) => {
      const name = a.treatment || "General Consultation";
      treatmentCounts[name] = (treatmentCounts[name] || 0) + 1;
    });

    let popularName = "N/A";
    let popularCount = 0;
    Object.entries(treatmentCounts).forEach(([name, count]) => {
      if (count > popularCount) {
        popularCount = count;
        popularName = name;
      }
    });

    const popularPercent = sourceAptsForTreatment.length > 0
      ? Math.round((popularCount / sourceAptsForTreatment.length) * 100)
      : 0;

    // 5. New Patients Metrics
    const newPatientsCount = pts.filter((p) => (p.totalVisits ?? (p.appointmentHistory || []).length) <= 1).length;
    const newPatientsIncrease = Math.max(0, thisMonthNewPatients - lastMonthNewPatients);

    // 6. Returning Patients Metrics
    const returningPatientsCount = pts.filter((p) => (p.totalVisits ?? (p.appointmentHistory || []).length) > 1).length;
    const retentionRate = totalPatientsCount > 0
      ? Math.round((returningPatientsCount / totalPatientsCount) * 100)
      : 0;

    const cardsMetrics = {
      totalPatients: totalPatientsCount,
      totalPatientsMonthIncrease: thisMonthNewPatients,
      totalPatientsTrend,

      totalAppointments: totalAppointmentsCount,
      totalAppointmentsMonthIncrease: thisMonthAptsCount,
      totalAppointmentsTrend,

      completedTreatments: completedTreatmentsCount,
      completionRate,

      popularTreatmentName: popularName,
      popularTreatmentCount: popularCount,
      popularTreatmentPercent: popularPercent,

      newPatients: newPatientsCount,
      newPatientsMonthIncrease: newPatientsIncrease,

      returningPatients: returningPatientsCount,
      retentionRate
    };

    // Chart 1: Monthly Appointment Trend (Line Chart)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const targetTrendYear = monthlyTrendYearFilter === "Last Year" ? currentYear - 1 : currentYear;

    const monthlyTrendData = monthNames.map((mName, idx) => {
      const prefix = `${targetTrendYear}-${String(idx + 1).padStart(2, "0")}`;
      const count = apts.filter((a) => (a.appointmentDate || a.date || "").startsWith(prefix)).length;
      return { month: mName, appointmentCount: count };
    });

    // Chart 2: Treatment Distribution (Bar Chart - sorted descending)
    const allTreatmentsMap = {};
    completedApts.forEach((a) => {
      const name = a.treatment || "General Consultation";
      allTreatmentsMap[name] = (allTreatmentsMap[name] || 0) + 1;
    });

    let treatmentDistributionData = Object.entries(allTreatmentsMap)
      .map(([treatment, count]) => ({ treatment, count }))
      .sort((a, b) => b.count - a.count);

    if (treatmentDistributionData.length === 0) {
      // Fallback to all non-rejected appointments if completed list is empty
      const fallbackMap = {};
      filteredApts.forEach((a) => {
        const name = a.treatment || "General Consultation";
        fallbackMap[name] = (fallbackMap[name] || 0) + 1;
      });
      treatmentDistributionData = Object.entries(fallbackMap)
        .map(([treatment, count]) => ({ treatment, count }))
        .sort((a, b) => b.count - a.count);
    }

    // Chart 3: Appointment Status Distribution (Doughnut Chart - Excludes Pending)
    const statusCounts = {
      Completed: 0,
      Confirmed: 0,
      "Checked In": 0,
      Cancelled: 0
    };

    filteredApts.forEach((a) => {
      const st = a.status || "";
      if (st === "Completed") statusCounts.Completed += 1;
      else if (st === "Confirmed" || st === "Rescheduled") statusCounts.Confirmed += 1;
      else if (["Checked In", "In Treatment", "Patient Arrived"].includes(st)) statusCounts["Checked In"] += 1;
      else if (st === "Cancelled") statusCounts.Cancelled += 1;
    });

    const statusDistributionData = Object.entries(statusCounts)
      .map(([status, count]) => ({ status, count }))
      .filter((s) => s.count > 0);

    // Chart 4: Weekly Appointment Trend (Bar Chart: Monday - Sunday)
    const weekdaysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weeklyCounts = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };

    filteredApts.forEach((a) => {
      const rawD = a.appointmentDate || a.date;
      if (!rawD) return;
      const dObj = new Date(rawD);
      if (!isNaN(dObj.getTime())) {
        const dayIdx = dObj.getDay(); // 0 is Sun
        const dayName = dayIdx === 0 ? "Sunday" : weekdaysOrder[dayIdx - 1];
        weeklyCounts[dayName] = (weeklyCounts[dayName] || 0) + 1;
      }
    });

    const weeklyActivityData = weekdaysOrder.map((day) => ({
      day,
      count: weeklyCounts[day] || 0
    }));

    // Chart 5: New vs Returning Patients (Grouped Bar Chart)
    const targetPtYear = newVsReturningYearFilter === "Last Year" ? currentYear - 1 : currentYear;

    const newVsReturningData = monthNames.map((mName, idx) => {
      const prefix = `${targetPtYear}-${String(idx + 1).padStart(2, "0")}`;
      const newPtsCount = pts.filter((p) => (p.firstVisitDate || p.createdAt || "").startsWith(prefix)).length;
      const aptsInMonth = apts.filter((a) => (a.appointmentDate || a.date || "").startsWith(prefix));
      const returningCount = Math.max(0, aptsInMonth.length - newPtsCount);
      return {
        month: mName,
        newPatients: newPtsCount,
        returningPatients: returningCount
      };
    });

    return {
      cardsMetrics,
      monthlyTrendData,
      treatmentDistributionData,
      statusDistributionData,
      weeklyActivityData,
      newVsReturningData
    };
  }, [rawAppointments, rawPatients, activeRange, customRange, monthlyTrendYearFilter, newVsReturningYearFilter]);

  // Loading Skeleton State
  if (isLoading && (!rawAppointments || !rawPatients)) {
    return (
      <div className="space-y-6 w-full min-w-0 pb-12 animate-pulse">
        <div className="h-16 bg-white border border-slate-100 rounded-[24px]" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-white border border-slate-100 rounded-[24px]" />
          ))}
        </div>
        <div className="h-72 bg-white border border-slate-100 rounded-[24px]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white border border-slate-100 rounded-[24px]" />
          <div className="h-64 bg-white border border-slate-100 rounded-[24px]" />
        </div>
      </div>
    );
  }

  const {
    cardsMetrics,
    monthlyTrendData,
    treatmentDistributionData,
    statusDistributionData,
    weeklyActivityData,
    newVsReturningData
  } = analyticsData;

  return (
    <div className="space-y-6 font-sans select-none w-full min-w-0 pb-12">
      {/* 1. Global Date Range Filter Toolbar */}
      <FilterToolbar
        activeRange={activeRange}
        onRangeChange={setActiveRange}
        customRange={customRange}
        onCustomRangeChange={handleCustomRangeChange}
        onRefresh={handleRefresh}
        isRefreshing={isLoading}
      />

      {/* SECTION 1: TOP 6 INSIGHT CARDS */}
      <DoctorInsightCards metrics={cardsMetrics} />

      {/* SECTION 2: CHART 1 - MONTHLY APPOINTMENT TREND (Line Chart) */}
      <MonthlyTrendChart
        monthlyTrend={monthlyTrendData}
        filterYear={monthlyTrendYearFilter}
        onYearFilterChange={setMonthlyTrendYearFilter}
      />

      {/* SECTION 3: CHARTS 2 & 3 - TREATMENT DISTRIBUTION & APPOINTMENT STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TreatmentBarChart treatmentDistribution={treatmentDistributionData} />
        <StatusDoughnutChart appointmentStatus={statusDistributionData} />
      </div>

      {/* SECTION 4: CHARTS 4 & 5 - WEEKLY APPOINTMENT TREND & NEW VS RETURNING PATIENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivityChart weeklyActivity={weeklyActivityData} />
        <NewVsReturningChart
          newVsReturningData={newVsReturningData}
          filterYear={newVsReturningYearFilter}
          onYearFilterChange={setNewVsReturningYearFilter}
        />
      </div>
    </div>
  );
}

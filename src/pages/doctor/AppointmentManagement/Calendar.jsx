// src/pages/doctor/AppointmentManagement/Calendar.jsx

import React, { useState } from "react";
import CalendarHeader from "../../../components/doctor/calendar/CalendarHeader";
import CalendarToolbar from "../../../components/doctor/calendar/CalendarToolbar";
import MonthView from "../../../components/doctor/calendar/MonthView";
import WeekView from "../../../components/doctor/calendar/WeekView";
import DayView from "../../../components/doctor/calendar/DayView";
import AppointmentPopover from "../../../components/doctor/calendar/AppointmentPopover";
import useAppointments from "../../../hooks/useAppointments";
import Button from "../../../components/common/Button";
import { getLocalDateString } from "../../../utils/dateUtils";

// Helper mapper to normalize backend appointment model to UI representation
const mapBackendAppointmentToUI = (apt) => {
  if (!apt) return null;
  const rawDate = apt.appointmentDate || apt.date || "";
  let formattedDate = "";
  if (typeof rawDate === "string" && rawDate.length >= 10) {
    formattedDate = rawDate.split("T")[0];
  } else if (rawDate) {
    formattedDate = getLocalDateString(rawDate);
  }
  const todayStr = getLocalDateString();

  return {
    id: apt._id || apt.id,
    aptNumber: apt.appointmentNumber || apt.aptNumber || (apt._id ? `APT-${apt._id.slice(-4).toUpperCase()}` : "APT-1001"),
    patientName: apt.patient?.name || apt.patientName || "Patient",
    phoneNumber: apt.patient?.phone || apt.phoneNumber || apt.phone || "N/A",
    email: apt.patient?.email || apt.email || "",
    treatment: apt.treatment || "General Consultation",
    doctor: apt.doctor || "Dr. K. Ravindra Babu",
    status: apt.status || "Pending",
    source: apt.source || "Online",
    date: formattedDate || todayStr,
    time: apt.appointmentTime || apt.time || "10:00 AM",
    notes: apt.message || apt.notes || "",
    raw: apt
  };
};

export default function CalendarView() {
  const {
    appointments: rawAppointments,
    loading,
    error,
    fetchAppointments
  } = useAppointments();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // 'month' | 'week' | 'day'
  const [selectedDateStr, setSelectedDateStr] = useState(getLocalDateString(new Date()));
  const [activeFilter, setActiveFilter] = useState("All"); // 'All' | 'Today' | 'Tomorrow' | 'This Week' | 'This Month'
  const [statusFilter, setStatusFilter] = useState("All"); // 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApt, setSelectedApt] = useState(null);

  const mappedAppointments = Array.isArray(rawAppointments)
    ? rawAppointments.map(mapBackendAppointmentToUI).filter(Boolean)
    : [];

  // Date Navigation Handlers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === "month") d.setMonth(d.getMonth() - 1);
    else if (viewMode === "week") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === "month") d.setMonth(d.getMonth() + 1);
    else if (viewMode === "week") d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(getLocalDateString(now));
  };

  // Filter & Search Pipeline
  const getFilteredAppointments = () => {
    let list = [...mappedAppointments];
    const todayStr = getLocalDateString(new Date());

    // Status Filter
    if (statusFilter !== "All") {
      list = list.filter((a) => a.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Date Range Filter
    if (activeFilter === "Today") {
      list = list.filter((a) => a.date === todayStr);
    } else if (activeFilter === "Tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = getLocalDateString(tomorrow);
      list = list.filter((a) => a.date === tomorrowStr);
    } else if (activeFilter === "This Week") {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const startStr = getLocalDateString(start);
      const endStr = getLocalDateString(end);
      list = list.filter((a) => a.date >= startStr && a.date <= endStr);
    } else if (activeFilter === "This Month") {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const monthPrefix = `${year}-${month}`;
      list = list.filter((a) => a.date.startsWith(monthPrefix));
    }

    // Search Query Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          (a.patientName && a.patientName.toLowerCase().includes(q)) ||
          (a.phoneNumber && a.phoneNumber.toLowerCase().includes(q)) ||
          (a.treatment && a.treatment.toLowerCase().includes(q)) ||
          (a.aptNumber && a.aptNumber.toLowerCase().includes(q))
      );
    }

    return list;
  };

  const filteredAppointments = getFilteredAppointments();

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full py-12">
        <div className="w-10 h-10 border-4 border-[#0E2A6D]/20 border-t-[#0E2A6D] rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Loading clinic calendar...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-12">
        <p className="font-semibold text-rose-800 text-sm">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchAppointments}>
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none font-sans w-full min-w-0 pb-12">
      {/* Top Controls Toolbar */}
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Filter Pills */}
      <CalendarToolbar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Dynamic View Mode */}
      {viewMode === "month" && (
        <MonthView
          currentDate={currentDate}
          appointments={filteredAppointments}
          selectedDateStr={selectedDateStr}
          onSelectDate={setSelectedDateStr}
          onSelectApt={setSelectedApt}
        />
      )}

      {viewMode === "week" && (
        <WeekView
          currentDate={currentDate}
          appointments={filteredAppointments}
          onSelectApt={setSelectedApt}
        />
      )}

      {viewMode === "day" && (
        <DayView
          currentDate={currentDate}
          appointments={filteredAppointments}
          onSelectApt={setSelectedApt}
        />
      )}

      {/* Appointment Detail Modal */}
      <AppointmentPopover
        isOpen={selectedApt !== null}
        onClose={() => setSelectedApt(null)}
        appointment={selectedApt}
      />
    </div>
  );
}

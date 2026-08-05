// src/components/receptionist/appointments/AppointmentTable.jsx

import React, { useState } from "react";
import AppointmentFilters from "./AppointmentFilters";
import AppointmentRow from "./AppointmentRow";
import SearchBar from "../common/SearchBar";
import EmptyState from "../common/EmptyState";
import { Plus } from "lucide-react";
import { getLocalDateString } from "../../../utils/dateUtils";

const PAGE_SIZE = 10;

export const mapBackendAppointmentToUI = (apt) => {
  if (!apt) return null;
  const isObj = typeof apt.patient === "object" && apt.patient !== null;
  const patientName = isObj ? apt.patient.name : apt.patientName || apt.name || "Patient";
  const phoneNumber = isObj ? apt.patient.phone : apt.phoneNumber || apt.phone || "N/A";
  const dateStr = apt.appointmentDate ? getLocalDateString(apt.appointmentDate) : apt.date || getLocalDateString();

  return {
    id: apt._id || apt.id,
    aptNumber: apt.aptNumber || (apt._id ? `APT-${String(apt._id).slice(-4).toUpperCase()}` : "APT-NEW"),
    patientName,
    phoneNumber,
    treatment: apt.treatment || "General Checkup",
    doctor: apt.doctor || "Dr. Kavuturu",
    date: dateStr,
    time: apt.appointmentTime || apt.time || "10:00 AM",
    status: apt.status || "Confirmed",
    bookingSource: apt.bookingSource || apt.source || "Walk-in",
    notes: apt.notes || "",
    raw: apt
  };
};

export default function AppointmentTable({
  appointments = [],
  userRole = "receptionist",
  onNew,
  onView,
  onEdit,
  onConfirm,
  onStatusChange,
  onCancel,
  activeFilter = "All",
  onFilterChange,
  searchTerm = "",
  onSearchChange
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const match = String(timeStr).match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : "";
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const todayStr = getLocalDateString();
  const allMapped = (appointments || []).map(mapBackendAppointmentToUI).filter(Boolean);

  // Calculate tab counts
  const counts = {
    All: allMapped.filter((a) => a.status !== "Rejected" && a.status !== "Pending").length,
    Today: allMapped.filter((a) => a.date === todayStr && a.status !== "Rejected" && a.status !== "Pending").length,
    Upcoming: allMapped.filter(
      (a) => a.date > todayStr && a.status !== "Completed" && a.status !== "Cancelled" && a.status !== "Pending" && a.status !== "Rejected"
    ).length,
    Completed: allMapped.filter((a) => a.status === "Completed").length,
    Cancelled: allMapped.filter((a) => a.status === "Cancelled").length,
  };

  // Filter Pipeline
  const getFilteredAppointments = () => {
    let list = [...allMapped];

    if (activeFilter === "Today") {
      list = list.filter((apt) => apt.date === todayStr && apt.status !== "Rejected" && apt.status !== "Pending");
      list.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
    } else if (activeFilter === "Upcoming") {
      list = list.filter(
        (apt) => apt.date > todayStr && apt.status !== "Completed" && apt.status !== "Cancelled" && apt.status !== "Pending" && apt.status !== "Rejected"
      );
      list.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
      });
    } else if (activeFilter === "Completed") {
      list = list.filter((apt) => apt.status === "Completed");
    } else if (activeFilter === "Cancelled") {
      list = list.filter((apt) => apt.status === "Cancelled");
    } else {
      list = list.filter((apt) => apt.status !== "Rejected" && apt.status !== "Pending");
    }

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      list = list.filter((apt) => {
        const pName = (apt.patientName || "").toLowerCase();
        const pPhone = (apt.phoneNumber || "").toLowerCase();
        const pTreat = (apt.treatment || "").toLowerCase();
        const pDoc = (apt.doctor || "").toLowerCase();
        const pAptNum = (apt.aptNumber || "").toLowerCase();
        const pId = String(apt.id || "").toLowerCase();

        return (
          pName.includes(q) ||
          pPhone.includes(q) ||
          pTreat.includes(q) ||
          pDoc.includes(q) ||
          pAptNum.includes(q) ||
          pId.includes(q)
        );
      });
    }

    return list;
  };

  const filtered = getFilteredAppointments();
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pagedList = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const headers = ["Time", "Patient", "Phone", "Treatment", "Doctor", "Status", "Source", "Actions"];

  let emptyTitle = "No Appointments Found";
  let emptyDesc = "No appointments scheduled in the system yet.";

  if (searchTerm.trim() !== "") {
    emptyTitle = "No Matching Appointments";
    emptyDesc = "No appointments match your search. Try a different patient name, phone number, or treatment.";
  } else if (activeFilter === "Today") {
    emptyTitle = "No Appointments Scheduled Today";
    emptyDesc = "Your daily schedule for today is currently clear.";
  } else if (activeFilter === "Upcoming") {
    emptyTitle = "No Upcoming Appointments";
    emptyDesc = "There are currently no upcoming appointments scheduled for future dates.";
  } else if (activeFilter === "Completed") {
    emptyTitle = "No Completed Appointments";
    emptyDesc = "No completed patient appointments found.";
  } else if (activeFilter === "Cancelled") {
    emptyTitle = "No Cancelled Appointments";
    emptyDesc = "No cancelled appointments found in the system.";
  }

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xs overflow-hidden select-none">
      
      {/* Header bar */}
      <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Schedule Overview
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-1">
            View patient appointments, status, and doctor assignments.
          </p>
        </div>
      </div>

      {/* Filter Tabs & In-table Search + New Appointment Action Row */}
      <div className="p-4 sm:px-6 bg-[#F8FAFC] border-b border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <AppointmentFilters
          activeFilter={activeFilter}
          counts={counts}
          onChangeFilter={(filter) => {
            if (onFilterChange) onFilterChange(filter);
            setCurrentPage(1);
          }}
        />

        {/* Search Bar and New Appointment Button Perfectly Aligned */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="w-full lg:w-64">
            <SearchBar
              placeholder="Search schedule..."
              value={searchTerm}
              onChange={(val) => {
                if (onSearchChange) onSearchChange(val);
                setCurrentPage(1);
              }}
            />
          </div>

          {userRole === "receptionist" && onNew && (
            <button
              type="button"
              onClick={onNew}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-4 h-9.5 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center gap-2 flex-shrink-0 cursor-pointer active:scale-98 outline-none"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="whitespace-nowrap">New Appointment</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content Area */}
      <div className="overflow-x-auto">
        {pagedList.length === 0 ? (
          <div className="p-10 text-center">
            <EmptyState
              title={emptyTitle}
              description={emptyDesc}
              onNew={userRole === "receptionist" ? onNew : undefined}
              actionLabel="New Appointment"
            />
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {headers.map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 whitespace-nowrap ${i === headers.length - 1 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {pagedList.map((apt) => (
                <AppointmentRow
                  key={apt.id}
                  appointment={apt}
                  userRole={userRole}
                  onView={onView}
                  onEdit={onEdit}
                  onConfirm={onConfirm}
                  onStatusChange={(newStatus) => onStatusChange && onStatusChange(apt.id, newStatus)}
                  onCancel={onCancel}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="font-semibold text-slate-900">{pagedList.length}</strong> of{" "}
            <strong className="font-semibold text-slate-900">{filtered.length}</strong> appointments
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-slate-700 hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="text-slate-400 px-1">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-slate-700 hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

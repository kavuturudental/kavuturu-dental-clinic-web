// src/pages/doctor/AppointmentManagement/Dashboard.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Eye,
  Search,
  Activity
} from "lucide-react";
import useAppointments from "../../../hooks/useAppointments";
import DashboardSummaryCards from "../../../components/common/DashboardSummaryCards";
import AppointmentDetailModal from "../../../components/doctor/appointments/AppointmentDetailModal";
import EditAppointmentModal from "../../../components/doctor/appointments/EditAppointmentModal";
import { getLocalDateString } from "../../../utils/dateUtils";

export default function AppointmentDashboard() {
  const {
    appointments: rawAppointments,
    loading,
    error,
    fetchAppointments,
    changeAppointmentStatus,
    editAppointment
  } = useAppointments();

  const [selectedApt, setSelectedApt] = useState(null);
  const [editApt, setEditApt] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const todayStr = getLocalDateString();

  // Format appointments array to match dashboard expectations
  const appointments = (rawAppointments || []).map((a) => {
    let dStr = todayStr;
    if (typeof a.appointmentDate === "string" && a.appointmentDate.length >= 10) {
      dStr = a.appointmentDate.split("T")[0];
    } else if (a.appointmentDate) {
      dStr = getLocalDateString(a.appointmentDate);
    }
    return {
      id: a._id || a.id,
      appointmentNumber: a.appointmentNumber || `KDC-${String(a._id).slice(-6).toUpperCase()}`,
      patientName: a.patient?.name || a.patientName || "Patient",
      phoneNumber: a.patient?.phone || a.phoneNumber || "N/A",
      email: a.patient?.email || a.email || "",
      treatment: a.treatment || "General Checkup",
      doctor: "Dr. K. Ravindra Babu",
      date: dStr,
      time: a.appointmentTime || a.time || "10:00 AM",
      status: a.status || "Pending",
      notes: a.message || a.notes || "",
      raw: a
    };
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await changeAppointmentStatus(id, newStatus);
      if (selectedApt && selectedApt.id === id) {
        setSelectedApt({ ...selectedApt, status: newStatus });
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleEditSubmit = async (id, updatedFields) => {
    try {
      await editAppointment(id, {
        treatment: updatedFields.treatment,
        status: updatedFields.status,
        appointmentTime: updatedFields.time,
        appointmentDate: updatedFields.date
      });
      setEditApt(null);
    } catch (err) {
      console.error("Edit appointment error:", err);
    }
  };

  // Filter today's list
  const filteredTodayList = appointments.filter((a) => {
    const isToday = a.date === todayStr;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.patientName.toLowerCase().includes(q) ||
      (a.phoneNumber && a.phoneNumber.includes(q)) ||
      a.treatment.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || a.status === statusFilter;

    return isToday && matchesSearch && matchesStatus;
  });

  const upcomingAppointments = appointments.filter((a) => a.date > todayStr);
  const upcomingList = upcomingAppointments.slice(0, 5);

  // Recent Activity Feed derived from appointments
  const recentActivityLogs = appointments.slice(0, 5).map((a) => ({
    time: a.time,
    action: `Appointment ${a.status}`,
    patient: a.patientName,
    treatment: a.treatment,
    statusStyle:
      a.status === "Completed"
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : a.status === "Confirmed"
        ? "bg-blue-50 text-blue-700 border-blue-100"
        : a.status === "Cancelled"
        ? "bg-rose-50 text-rose-700 border-rose-100"
        : "bg-amber-50 text-amber-700 border-amber-100"
  }));

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-50 text-blue-800 border-blue-200/80";
      case "Completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "Cancelled":
        return "bg-rose-50 text-rose-800 border-rose-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs animate-pulse bg-white rounded-[24px]">
        Loading live doctor dashboard metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-rose-500 text-xs bg-white rounded-[24px]">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none font-sans w-full min-w-0 pb-12">
      {/* 4 Shared Dashboard Summary Cards (GET /api/dashboard/summary) */}
      <DashboardSummaryCards />

      {/* Main Grid: Today's Schedule (Left) + Sidebar Widgets (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Today's Schedule Table (Cols 2) */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Today's Patient Schedule
              </h2>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Live list of appointments scheduled for today from MongoDB.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter schedule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none w-36 sm:w-48"
                />
              </div>

              <button
                type="button"
                onClick={fetchAppointments}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Refresh Schedule"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {filteredTodayList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-medium">
              No appointments scheduled for today in database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-6">Time</th>
                    <th className="py-3 px-6">Patient</th>
                    <th className="py-3 px-6">Treatment</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTodayList.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-700 font-bold">{apt.time}</td>
                      <td className="py-4 px-6 font-semibold text-slate-900">{apt.patientName}</td>
                      <td className="py-4 px-6 text-slate-600">{apt.treatment}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${getStatusBadgeStyle(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedApt(apt)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {apt.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(apt.id, "Confirmed")}
                            className="px-2 py-1 text-[11px] font-bold bg-blue-50 text-blue-800 rounded-lg"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status === "Confirmed" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(apt.id, "Completed")}
                            className="px-2 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 rounded-lg"
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming & Recent Feed */}
        <div className="space-y-6">
          {/* Upcoming Widget */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                Upcoming Appointments
              </h3>
              <Link to="/doctor/appointment-management/appointments" className="text-xs text-[#0E2A6D] font-semibold hover:underline">
                View All
              </Link>
            </div>

            {upcomingList.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No upcoming appointments.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingList.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.patientName}</h4>
                      <span className="text-[11px] text-slate-500">{item.treatment}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-slate-700 font-bold block">{item.time}</span>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed Widget */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                  Recent Activity Log
                </h3>
              </div>
            </div>

            {recentActivityLogs.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No recent activity.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentActivityLogs.map((log, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-semibold text-slate-900">{log.patient}</h4>
                      <span className="text-[10px] text-slate-400">{log.action} ({log.treatment})</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{log.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedApt && (
        <AppointmentDetailModal
          appointment={selectedApt}
          isOpen={Boolean(selectedApt)}
          onClose={() => setSelectedApt(null)}
          onStatusChange={handleStatusChange}
          onEditClick={(apt) => {
            setEditApt(apt);
            setSelectedApt(null);
          }}
        />
      )}

      {editApt && (
        <EditAppointmentModal
          appointment={editApt}
          isOpen={Boolean(editApt)}
          onClose={() => setEditApt(null)}
          onSave={handleEditSubmit}
        />
      )}
    </div>
  );
}

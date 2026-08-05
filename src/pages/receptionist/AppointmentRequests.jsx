// src/receptionist/pages/AppointmentRequests.jsx

import React, { useState } from "react";
import DashboardLayout from "../../components/receptionist/layout/DashboardLayout";
import RequestTable from "../../components/receptionist/requests/RequestTable";
import RequestDetailDrawer from "../../components/receptionist/requests/RequestDetailDrawer";
import Modal from "../../components/receptionist/common/Modal";
import Input from "../../components/receptionist/common/Input";
import Button from "../../components/receptionist/common/Button";
import TimeSlotPicker from "../../components/common/TimeSlotPicker";
import useAppointmentRequests from "../../hooks/useAppointmentRequests";
import toast from "react-hot-toast";
import { getLocalDateString } from "../../utils/dateUtils";

export default function AppointmentRequests() {
  const {
    requests,
    loading,
    error,
    approveRequest,
    rejectRequest,
    rescheduleRequest
  } = useAppointmentRequests();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDrawerReq, setSelectedDrawerReq] = useState(null);
  const [rescheduleReq, setRescheduleReq] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: "", time: "10:00 AM" });

  const todayStr = getLocalDateString();

  // Accept Action
  const handleAccept = async (id) => {
    try {
      await approveRequest(id);
      toast.success("Request approved and appointment confirmed!");
    } catch (err) {
      toast.error("Failed to approve appointment request");
    }
  };

  // Reject Action
  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      toast.error("Request rejected.");
    } catch (err) {
      toast.error("Failed to reject appointment request");
    }
  };

  // Reschedule Action
  const handleOpenReschedule = (req) => {
    setRescheduleReq(req);
    setRescheduleForm({
      date: req.preferredDate || todayStr,
      time: req.preferredTime || "10:00 AM"
    });
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleReq) return;
    try {
      await rescheduleRequest(rescheduleReq._id || rescheduleReq.id, rescheduleForm);
      toast.success(`Rescheduled appointment request for ${rescheduleReq.patientName}`);
      setRescheduleReq(null);
    } catch (err) {
      toast.error("Failed to reschedule request");
    }
  };

  // Map backend format to component structure
  const formattedRequests = (requests || []).map((r) => ({
    id: r._id || r.id,
    patientName: r.patient?.name || r.name || r.patientName || "Patient",
    phoneNumber: r.patient?.phone || r.phone || r.phoneNumber || "N/A",
    email: r.patient?.email || r.email || "",
    treatment: r.treatment || "General Checkup",
    preferredDate: r.appointmentDate ? getLocalDateString(r.appointmentDate) : r.preferredDate || todayStr,
    preferredTime: r.appointmentTime || r.preferredTime || "10:00 AM",
    requestDate: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Recent",
    source: "Website",
    status: r.status || "Pending",
    notes: r.message || r.notes || "",
    raw: r
  }));

  return (
    <DashboardLayout searchValue={searchTerm} onSearchChange={setSearchTerm}>
      <div className="p-1 space-y-2.5 max-w-[1500px] mx-auto font-sans select-none">
        {/* Pending Requests Workspace Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse bg-white rounded-[24px]">
            Loading appointment requests from database...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 text-xs bg-white rounded-[24px]">
            {error}
          </div>
        ) : (
          <RequestTable
            requests={formattedRequests}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAccept={handleAccept}
            onReject={handleReject}
            onReschedule={handleOpenReschedule}
            onViewDetails={(req) => setSelectedDrawerReq(req)}
          />
        )}

        {/* Detail Drawer */}
        <RequestDetailDrawer
          request={selectedDrawerReq}
          onClose={() => setSelectedDrawerReq(null)}
          onAccept={handleAccept}
          onReject={handleReject}
          onReschedule={handleOpenReschedule}
        />

        {/* Reschedule Modal */}
        <Modal
          isOpen={!!rescheduleReq}
          onClose={() => setRescheduleReq(null)}
          title="Reschedule Appointment Request"
        >
          {rescheduleReq && (
            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl space-y-0.5">
                <p className="font-bold text-amber-900">{rescheduleReq.patientName}</p>
                <p className="text-amber-700 font-medium">Original Request: {rescheduleReq.preferredDate} at {rescheduleReq.preferredTime}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">New Date</label>
                <Input
                  type="date"
                  min={todayStr}
                  value={rescheduleForm.date}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">New Time Slot</label>
                <TimeSlotPicker
                  selectedTime={rescheduleForm.time}
                  onSelectTime={(t) => setRescheduleForm({ ...rescheduleForm, time: t })}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRescheduleReq(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Confirm Reschedule
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}

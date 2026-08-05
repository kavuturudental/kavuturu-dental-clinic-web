// src/pages/doctor/AppointmentManagement/AppointmentRequests.jsx

import React, { useState } from "react";
import RequestTable from "../../../components/receptionist/requests/RequestTable";
import RequestDetailDrawer from "../../../components/receptionist/requests/RequestDetailDrawer";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import TimeSlotPicker from "../../../components/common/TimeSlotPicker";
import useAppointmentRequests from "../../../hooks/useAppointmentRequests";
import toast from "react-hot-toast";
import { getLocalDateString } from "../../../utils/dateUtils";

// Helper mapper to normalize backend appointment request model to UI representation
const mapBackendRequestToUI = (req) => {
  if (!req) return null;
  const rawDate = req.preferredDate || req.appointmentDate || req.date || "";
  const formattedDate = typeof rawDate === "string" ? rawDate.split("T")[0] : "";
  const todayStr = getLocalDateString();

  return {
    id: req._id || req.id,
    reqNumber: req.requestNumber || req.reqNumber || (req._id ? `REQ-${req._id.slice(-4).toUpperCase()}` : "REQ-1001"),
    patientName: req.patient?.name || req.patientName || req.name || "Patient",
    phoneNumber: req.patient?.phone || req.phoneNumber || req.phone || "N/A",
    phone: req.patient?.phone || req.phoneNumber || req.phone || "N/A",
    email: req.patient?.email || req.email || "",
    treatment: req.treatment || "General Consultation",
    doctor: req.doctor || "Dr. K. Ravindra Babu",
    status: req.status || "Pending",
    preferredDate: formattedDate || todayStr,
    preferredTime: req.preferredTime || req.appointmentTime || req.time || "10:00 AM",
    submittedAt: req.createdAt ? new Date(req.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Today",
    message: req.message || req.notes || "No additional notes provided.",
    raw: req
  };
};

export default function AppointmentRequests() {
  const {
    requests: rawRequests,
    loading,
    error,
    fetchRequests,
    approveRequest,
    rejectRequest,
    rescheduleRequest
  } = useAppointmentRequests();

  const [selectedDrawerReq, setSelectedDrawerReq] = useState(null);
  const [rescheduleReq, setRescheduleReq] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: "", time: "10:00 AM" });

  const mappedRequests = (rawRequests || []).map(mapBackendRequestToUI).filter(Boolean);

  // Accept / Approve Action
  const handleAccept = async (id) => {
    try {
      await approveRequest(id);
      toast.success("Request accepted and moved to schedule!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept request");
    }
  };

  // Reject Action
  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      toast.error("Request rejected.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject request");
    }
  };

  // Reschedule Trigger
  const handleOpenReschedule = (req) => {
    setRescheduleReq(req);
    setRescheduleForm({
      date: req.preferredDate || getLocalDateString(),
      time: req.preferredTime || "10:00 AM"
    });
  };

  // Reschedule Submission
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleReq) return;
    try {
      await rescheduleRequest(rescheduleReq.id, rescheduleForm);
      toast.success(`Rescheduled appointment request for ${rescheduleReq.patientName}`);
      setRescheduleReq(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to reschedule request");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full py-12">
        <div className="w-10 h-10 border-4 border-[#0E2A6D]/20 border-t-[#0E2A6D] rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Loading appointment requests from server...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-12">
        <p className="font-semibold text-rose-800 text-sm">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchRequests}>
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans w-full min-w-0 pb-12">
      
      {/* Pending Booking Requests Workspace Table */}
      <RequestTable
        requests={mappedRequests}
        onAccept={handleAccept}
        onReschedule={handleOpenReschedule}
        onReject={handleReject}
        onView={(req) => setSelectedDrawerReq(req)}
      />

      {/* Right-Side Review Drawer */}
      <RequestDetailDrawer
        isOpen={selectedDrawerReq !== null}
        onClose={() => setSelectedDrawerReq(null)}
        request={selectedDrawerReq}
        onAccept={handleAccept}
        onReject={handleReject}
      />

    </div>
  );
}

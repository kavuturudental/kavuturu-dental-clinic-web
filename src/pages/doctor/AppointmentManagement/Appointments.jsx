// src/pages/doctor/AppointmentManagement/Appointments.jsx

import React, { useState, useEffect } from "react";
import DashboardSummaryCards from "../../../components/common/DashboardSummaryCards";
import AppointmentTable from "../../../components/receptionist/appointments/AppointmentTable";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import TimeSlotPicker from "../../../components/common/TimeSlotPicker";
import useAppointments from "../../../hooks/useAppointments";
import useAppointmentRequests from "../../../hooks/useAppointmentRequests";
import { useDialog } from "../../../context/DialogContext";
import toast from "react-hot-toast";
import { getLocalDateString, formatStatusDisplay, cleanTimeIST } from "../../../utils/dateUtils";
import { AlertTriangle } from "lucide-react";

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
    aptNumber: apt.appointmentNumber || apt.aptNumber || (apt._id ? `APT-${String(apt._id).slice(-4).toUpperCase()}` : "APT-1001"),
    patientName: apt.patient?.name || apt.patientName || "Patient",
    phoneNumber: apt.patient?.phone || apt.phoneNumber || apt.phone || "N/A",
    email: apt.patient?.email || apt.email || "",
    treatment: apt.treatment || "General Consultation",
    doctor: apt.doctor || "Dr. K. Ravindra Babu",
    status: apt.status || "Confirmed",
    bookingSource: apt.bookingSource || apt.source || "Doctor",
    source: apt.bookingSource || apt.source || "Doctor",
    date: formattedDate || todayStr,
    time: apt.appointmentTime || apt.time || "10:00 AM",
    dateGroup: formattedDate === todayStr ? "Today" : "Upcoming",
    notes: apt.message || apt.notes || "",
    raw: apt
  };
};

export default function Appointments() {
  const {
    appointments: rawAppointments,
    loading,
    error,
    addAppointment,
    editAppointment,
    changeAppointmentStatus,
    fetchAppointments
  } = useAppointments();
  const { requests } = useAppointmentRequests();
  const { showSuccess } = useDialog();

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalType, setModalType] = useState(null); // 'view' | 'edit' | 'new' | 'cancel' | 'complete'
  const [selectedApt, setSelectedApt] = useState(null);
  const [targetStatus, setTargetStatus] = useState("");

  useEffect(() => {
    fetchAppointments();
    setModalType(null);
    setSelectedApt(null);
  }, [fetchAppointments]);

  const todayStr = getLocalDateString();

  // New appointment form state
  const [newApt, setNewApt] = useState({
    patientName: "",
    phoneNumber: "",
    email: "",
    treatment: "Laser Root Canal",
    date: todayStr,
    time: "10:00 AM",
    bookingSource: "Doctor",
    notes: ""
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    treatment: "",
    doctor: "",
    status: "",
    bookingSource: "Doctor",
    time: "",
    date: ""
  });

  const mappedAppointments = Array.isArray(rawAppointments)
    ? rawAppointments.map(mapBackendAppointmentToUI).filter(Boolean)
    : [];

  const todayApts = mappedAppointments.filter(
    (a) => a.date === todayStr && a.status !== "Rejected"
  );
  const todaysAppointmentsCount = todayApts.length;

  const pendingRequestsCount = Array.isArray(requests)
    ? requests.filter((r) => (r.status || "").toLowerCase() === "pending").length
    : 0;

  const todayCompletedCount = todayApts.filter((a) => a.status === "Completed").length;
  const todayCancelledCount = todayApts.filter((a) => a.status === "Cancelled").length;
  const remainingTodayCount = Math.max(
    0,
    todaysAppointmentsCount - todayCompletedCount - todayCancelledCount
  );

  const remainingTodayApts = todayApts.filter(
    (a) => a.status !== "Completed" && a.status !== "Cancelled"
  );

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

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sortedRemaining = [...remainingTodayApts].sort((a, b) => {
    return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
  });

  let nextApt = sortedRemaining.find((a) => {
    if (["Checked In", "In Treatment", "Patient Arrived"].includes(a.status)) {
      return true;
    }
    return parseTimeToMinutes(a.time) >= currentMinutes - 15;
  });

  if (!nextApt && sortedRemaining.length > 0) {
    nextApt = sortedRemaining[0];
  }

  const summaryData = {
    todaysAppointments: todaysAppointmentsCount,
    pendingRequests: pendingRequestsCount,
    nextAppointment: nextApt
      ? {
          patientName: nextApt.patientName || nextApt.name,
          time: cleanTimeIST(nextApt.time || nextApt.appointmentTime)
        }
      : null,
    remainingToday: remainingTodayCount
  };

  const handleStatusChange = async (apt, newStatus) => {
    let rawStatus = newStatus;
    if (!rawStatus || typeof rawStatus === "object") {
      rawStatus = typeof apt === "string" ? apt : "Checked In";
    }
    const displayStatus = formatStatusDisplay(rawStatus);
    if (displayStatus === "Completed" || rawStatus === "Completed") {
      setSelectedApt(apt);
      setTargetStatus("Completed");
      setModalType("complete");
      return;
    }

    try {
      await changeAppointmentStatus(apt.id, rawStatus);
      const patientName = apt.patientName || apt.name || "Patient";
      toast.success(`Updated status to "${displayStatus}" for ${patientName}`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update status to ${displayStatus}`);
    }
  };

  const handleConfirmComplete = async () => {
    if (!selectedApt) return;
    try {
      await changeAppointmentStatus(selectedApt.id, "Completed");
      toast.success(`Appointment marked as Completed for ${selectedApt.patientName}`);
      setModalType(null);
      setSelectedApt(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete appointment");
    }
  };

  const handleConfirm = async (apt) => {
    try {
      await changeAppointmentStatus(apt.id, "Confirmed");
      toast.success(`Appointment confirmed for ${apt.patientName}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm appointment");
    }
  };

  const handleCancelClick = (apt) => {
    setSelectedApt(apt);
    setModalType("cancel");
  };

  const handleConfirmCancel = async () => {
    if (!selectedApt) return;
    try {
      await changeAppointmentStatus(selectedApt.id, "Cancelled");
      toast.success(`Appointment cancelled for ${selectedApt.patientName}`);
      setModalType(null);
      setSelectedApt(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel appointment");
    }
  };

  const handleView = (apt) => {
    setSelectedApt(apt);
    setModalType("view");
  };

  const handleEdit = (apt) => {
    if (apt.status === "Completed" || apt.status === "Cancelled") {
      toast.error("Completed or Cancelled appointments cannot be edited.");
      return;
    }
    setSelectedApt(apt);
    setEditForm({
      treatment: apt.treatment || "Laser Root Canal",
      doctor: apt.doctor || "Dr. K. Ravindra Babu",
      status: apt.status || "Confirmed",
      bookingSource: apt.bookingSource || "Doctor",
      time: apt.time || "10:00 AM",
      date: apt.date || todayStr
    });
    setModalType("edit");
  };

  const handleEditPreSubmit = (e) => {
    e.preventDefault();
    if (!selectedApt) return;

    const isCheckedIn = ["Checked In", "In Treatment", "Patient Arrived"].includes(selectedApt.status);
    const origDate = selectedApt.date || (selectedApt.appointmentDate ? getLocalDateString(selectedApt.appointmentDate) : "");
    const origTime = selectedApt.time || selectedApt.appointmentTime;

    if (isCheckedIn && (editForm.date !== origDate || editForm.time !== origTime)) {
      toast.error("Checked-in appointments cannot be rescheduled. Please complete or cancel the appointment instead.");
      return;
    }

    setModalType("confirmEdit");
  };

  const handleConfirmEditSubmit = async () => {
    if (!selectedApt) return;
    try {
      await editAppointment(selectedApt.id, {
        treatment: editForm.treatment,
        doctor: editForm.doctor,
        status: editForm.status === "Rescheduled" ? "Confirmed" : editForm.status,
        bookingSource: editForm.bookingSource,
        appointmentTime: editForm.time,
        appointmentDate: editForm.date
      });

      showSuccess(
        "The appointment has been updated successfully.",
        "Appointment Updated"
      );

      setModalType(null);
      setSelectedApt(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update appointment");
    }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    if (!newApt.patientName || !newApt.phoneNumber || !newApt.treatment || !newApt.date || !newApt.time || !newApt.bookingSource) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        patientName: newApt.patientName,
        phoneNumber: newApt.phoneNumber,
        email: newApt.email,
        treatment: newApt.treatment,
        appointmentDate: newApt.date,
        appointmentTime: newApt.time,
        bookingSource: newApt.bookingSource,
        notes: newApt.notes,
        status: newApt.bookingSource === "Website" ? "Pending" : "Confirmed"
      };

      await addAppointment(payload);
      if (newApt.bookingSource === "Website") {
        toast.success(`Appointment request created for ${newApt.patientName} (Pending Review)`);
      } else {
        toast.success(`Confirmed appointment booked for ${newApt.patientName} via ${newApt.bookingSource}`);
      }

      setNewApt({
        patientName: "",
        phoneNumber: "",
        email: "",
        treatment: "Laser Root Canal",
        date: todayStr,
        time: "10:00 AM",
        bookingSource: "Doctor",
        notes: ""
      });
      setModalType(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create appointment");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full py-12">
        <div className="w-10 h-10 border-4 border-[#0E2A6D]/20 border-t-[#0E2A6D] rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Loading appointments from server...</p>
      </div>
    );
  }

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
      {/* 4 Summary Cards */}
      <DashboardSummaryCards summaryData={summaryData} />

      {/* Schedule Overview Table */}
      <AppointmentTable
        appointments={mappedAppointments}
        userRole="doctor"
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNew={() => setModalType("new")}
        onView={handleView}
        onEdit={handleEdit}
        onConfirm={handleConfirm}
        onStatusChange={handleStatusChange}
        onCancel={handleCancelClick}
      />

      {/* View Appointment Modal */}
      <Modal
        isOpen={modalType === "view" && selectedApt !== null}
        onClose={() => setModalType(null)}
        title="Appointment Details"
      >
        {selectedApt && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                  Appointment #
                </span>
                <span className="font-mono font-bold text-slate-900">{selectedApt.aptNumber || selectedApt.id}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                  Patient Name
                </span>
                <span className="font-bold text-slate-900">{selectedApt.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                  Phone
                </span>
                <span className="font-mono font-medium text-slate-700">{selectedApt.phoneNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                  Booking Source
                </span>
                <span className="font-bold text-slate-800">{selectedApt.bookingSource || "Doctor"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                  Treatment
                </span>
                <span className="font-medium text-slate-800">{selectedApt.treatment}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                  Status
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {selectedApt.status}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setModalType(null)}>
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={modalType === "edit" && selectedApt !== null}
        onClose={() => setModalType(null)}
        title={`Edit Appointment - ${selectedApt?.patientName}`}
      >
        <form onSubmit={handleEditPreSubmit} className="space-y-4">
          {selectedApt && ["Checked In", "In Treatment", "Patient Arrived"].includes(selectedApt.status) && (
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-[11px] font-medium leading-normal">
              Checked-in appointments cannot be rescheduled. Please complete or cancel the appointment instead.
            </div>
          )}

          <Input
            label="Treatment"
            value={editForm.treatment}
            onChange={(e) => setEditForm({ ...editForm, treatment: e.target.value })}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Source *</label>
            <select
              value={editForm.bookingSource}
              onChange={(e) => setEditForm({ ...editForm, bookingSource: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-2.5 outline-none text-xs"
              required
            >
              <option value="Doctor">Doctor</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Phone Call">Phone Call</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Email">Email</option>
              <option value="Website">Website</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status *</label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-2.5 outline-none text-xs font-semibold"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Patient Arrived">Patient Arrived</option>
              <option value="In Treatment">In Treatment</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={editForm.date}
              disabled={selectedApt && ["Checked In", "In Treatment", "Patient Arrived"].includes(selectedApt.status)}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot *</label>
              <TimeSlotPicker
                selectedDate={editForm.date}
                selectedTimeSlot={editForm.time}
                onSelectTimeSlot={(t) => setEditForm({ ...editForm, time: t })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Confirmation Modal */}
      <Modal
        isOpen={modalType === "confirmEdit" && selectedApt !== null}
        onClose={() => setModalType("edit")}
        title="Update Appointment"
      >
        <div className="space-y-4 text-xs font-sans">
          <p className="text-slate-600 font-medium leading-relaxed">
            Are you sure you want to save these changes? The appointment schedule will be updated immediately.
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalType("edit")}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleConfirmEditSubmit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal for Marking Completed */}
      <Modal
        isOpen={modalType === "complete" && selectedApt !== null}
        onClose={() => setModalType(null)}
        title="Complete Appointment Confirmation"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 font-medium">
            Are you sure you want to mark the appointment for <strong className="text-slate-900">{selectedApt?.patientName}</strong> ({selectedApt?.treatment}) as <strong className="text-emerald-700">Completed</strong>?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmComplete}>
              Yes, Mark Completed
            </Button>
          </div>
        </div>
      </Modal>

      {/* Internal Redesigned New Appointment Modal */}
      <Modal
        isOpen={modalType === "new"}
        onClose={() => setModalType(null)}
        title="Book Internal Appointment"
      >
        <form onSubmit={handleNewSubmit} className="space-y-3.5 text-xs">
          <Input
            label="Patient Name *"
            value={newApt.patientName}
            onChange={(e) => setNewApt({ ...newApt, patientName: e.target.value })}
            required
            placeholder="e.g. Ramesh Varma"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number *"
              value={newApt.phoneNumber}
              onChange={(e) => setNewApt({ ...newApt, phoneNumber: e.target.value })}
              required
              placeholder="+91 98480 12345"
            />
            <Input
              label="Email"
              type="email"
              value={newApt.email}
              onChange={(e) => setNewApt({ ...newApt, email: e.target.value })}
              placeholder="patient@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Treatment *"
              value={newApt.treatment}
              onChange={(e) => setNewApt({ ...newApt, treatment: e.target.value })}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Source *</label>
              <select
                value={newApt.bookingSource}
                onChange={(e) => setNewApt({ ...newApt, bookingSource: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none text-xs font-medium"
                required
              >
                <option value="Doctor">Doctor</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Email">Email</option>
                <option value="Website">Website</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Appointment Date *"
              type="date"
              value={newApt.date}
              onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Time *</label>
              <TimeSlotPicker
                selectedDate={newApt.date}
                selectedTimeSlot={newApt.time}
                onSelectTimeSlot={(t) => setNewApt({ ...newApt, time: t })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
            <textarea
              rows={2}
              value={newApt.notes}
              onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })}
              placeholder="Additional clinical notes..."
              className="w-full rounded-xl border border-slate-200 p-2.5 outline-none text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={modalType === "cancel" && selectedApt !== null}
        onClose={() => setModalType(null)}
        title="Cancel Appointment"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5 leading-relaxed">
              <p className="font-bold text-amber-950 text-xs sm:text-sm">
                Are you sure you want to cancel this appointment?
              </p>
              <p className="text-[11px] sm:text-xs font-medium text-amber-900/90 leading-normal">
                The appointment will be marked as <strong className="font-extrabold text-amber-950">Cancelled</strong> and will remain in the patient's appointment history. You can view it later in the <strong className="font-extrabold text-amber-950">Cancelled Appointments</strong> section.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setModalType(null)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Keep Appointment
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmCancel}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Cancel Appointment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

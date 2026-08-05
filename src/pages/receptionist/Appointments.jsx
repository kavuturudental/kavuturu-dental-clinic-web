// src/receptionist/pages/Appointments.jsx

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/receptionist/layout/DashboardLayout";
import DashboardSummaryCards from "../../components/common/DashboardSummaryCards";
import AppointmentTable, { mapBackendAppointmentToUI } from "../../components/receptionist/appointments/AppointmentTable";
import Modal from "../../components/receptionist/common/Modal";
import Input from "../../components/receptionist/common/Input";
import Button from "../../components/receptionist/common/Button";
import TimeSlotPicker from "../../components/common/TimeSlotPicker";
import useAppointments from "../../hooks/useAppointments";
import useAppointmentRequests from "../../hooks/useAppointmentRequests";
import { useDialog } from "../../context/DialogContext";
import toast from "react-hot-toast";
import { getLocalDateString, formatStatusDisplay, cleanTimeIST } from "../../utils/dateUtils";
import { AlertTriangle } from "lucide-react";

export default function Appointments() {
  const {
    appointments,
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
    bookingSource: "Receptionist",
    notes: ""
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    treatment: "",
    status: "",
    bookingSource: "Receptionist",
    time: "",
    date: ""
  });

  // Calculate 4 Operational Summary Stats
  const mappedAppointments = Array.isArray(appointments)
    ? appointments.map(mapBackendAppointmentToUI).filter(Boolean)
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
      setModalType("complete");
      return;
    }

    try {
      await changeAppointmentStatus(apt._id || apt.id, rawStatus);
      const patientName = apt.patient?.name || apt.patientName || apt.name || "Patient";
      toast.success(`Updated status to "${displayStatus}" for ${patientName}`);
    } catch (err) {
      toast.error(`Failed to update status to ${displayStatus}`);
    }
  };

  const handleConfirmComplete = async () => {
    if (!selectedApt) return;
    try {
      await changeAppointmentStatus(selectedApt._id || selectedApt.id, "Completed");
      toast.success(`Appointment marked as Completed for ${selectedApt.patient?.name || selectedApt.patientName}`);
      setModalType(null);
      setSelectedApt(null);
    } catch (err) {
      toast.error("Failed to complete appointment");
    }
  };

  // Actions
  const handleConfirm = async (apt) => {
    try {
      await changeAppointmentStatus(apt._id || apt.id, "Confirmed");
      toast.success(`Appointment confirmed for ${apt.patient?.name || apt.patientName}`);
    } catch (err) {
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
      await changeAppointmentStatus(selectedApt._id || selectedApt.id, "Cancelled");
      toast.error(`Appointment cancelled for ${selectedApt.patient?.name || selectedApt.patientName}`);
      setModalType(null);
      setSelectedApt(null);
    } catch (err) {
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
      treatment: apt.treatment || "",
      status: apt.status || "Confirmed",
      bookingSource: apt.bookingSource || "Receptionist",
      time: apt.appointmentTime || apt.time || "10:00 AM",
      date: apt.appointmentDate ? getLocalDateString(apt.appointmentDate) : todayStr
    });
    setModalType("edit");
  };

  const handleEditPreSubmit = (e) => {
    e.preventDefault();
    if (!selectedApt) return;

    const isCheckedIn = ["Checked In", "In Treatment", "Patient Arrived"].includes(selectedApt.status);
    const origDate = selectedApt.appointmentDate ? getLocalDateString(selectedApt.appointmentDate) : selectedApt.date;
    const origTime = selectedApt.appointmentTime || selectedApt.time;

    if (isCheckedIn && (editForm.date !== origDate || editForm.time !== origTime)) {
      toast.error("Checked-in appointments cannot be rescheduled. Please complete or cancel the appointment instead.");
      return;
    }

    setModalType("confirmEdit");
  };

  const handleConfirmEditSubmit = async () => {
    if (!selectedApt) return;
    try {
      await editAppointment(selectedApt._id || selectedApt.id, {
        treatment: editForm.treatment,
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
      await addAppointment({
        name: newApt.patientName,
        phone: newApt.phoneNumber,
        email: newApt.email,
        treatment: newApt.treatment,
        appointmentDate: newApt.date,
        appointmentTime: newApt.time,
        bookingSource: newApt.bookingSource,
        notes: newApt.notes,
        status: newApt.bookingSource === "Website" ? "Pending" : "Confirmed"
      });

      if (newApt.bookingSource === "Website") {
        toast.success(`Appointment request submitted for ${newApt.patientName} (Pending Review)`);
      } else {
        toast.success(`Confirmed appointment booked for ${newApt.patientName} via ${newApt.bookingSource}`);
      }

      setModalType(null);
      setNewApt({
        patientName: "",
        phoneNumber: "",
        email: "",
        treatment: "Laser Root Canal",
        date: todayStr,
        time: "10:00 AM",
        bookingSource: "Receptionist",
        notes: ""
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <DashboardLayout searchValue={searchTerm} onSearchChange={setSearchTerm}>
      <div className="p-1 space-y-2.5 max-w-[1600px] mx-auto font-sans select-none min-w-0">
        {/* 4 KPI Summary Cards */}
        <DashboardSummaryCards summaryData={summaryData} />

        {/* Main Appointment Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse bg-white rounded-[24px]">
            Loading live appointments from database...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 text-xs bg-white rounded-[24px]">
            {error}
          </div>
        ) : (
          <AppointmentTable
            appointments={appointments}
            userRole="receptionist"
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onConfirm={handleConfirm}
            onStatusChange={handleStatusChange}
            onCancel={handleCancelClick}
            onView={handleView}
            onEdit={handleEdit}
            onNew={() => setModalType("new")}
          />
        )}

        {/* View Details Modal */}
        <Modal
          isOpen={modalType === "view"}
          onClose={() => setModalType(null)}
          title="Appointment Details"
        >
          {selectedApt && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-mono text-slate-400 block">{selectedApt.appointmentNumber}</span>
                <h4 className="text-sm font-bold text-slate-900">{selectedApt.patientName}</h4>
                <p className="text-slate-600 font-mono">{selectedApt.phoneNumber}</p>
                <p className="text-slate-500">{selectedApt.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div><strong>Treatment:</strong> {selectedApt.treatment}</div>
                <div><strong>Booking Source:</strong> {selectedApt.bookingSource}</div>
                <div><strong>Status:</strong> {selectedApt.status}</div>
                <div><strong>Date:</strong> {selectedApt.date}</div>
                <div><strong>Time:</strong> {selectedApt.time}</div>
              </div>
              {selectedApt.message && (
                <div>
                  <strong>Message/Notes:</strong>
                  <p className="p-2.5 bg-slate-50 rounded-lg text-slate-600 mt-1">{selectedApt.message}</p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={modalType === "edit"}
          onClose={() => setModalType(null)}
          title="Edit Appointment"
        >
          <form onSubmit={handleEditPreSubmit} className="space-y-4 text-xs">
            {selectedApt && ["Checked In", "In Treatment", "Patient Arrived"].includes(selectedApt.status) && (
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-[11px] font-medium leading-normal">
                Checked-in appointments cannot be rescheduled. Please complete or cancel the appointment instead.
              </div>
            )}

            <Input
              label="Treatment"
              value={editForm.treatment}
              onChange={(e) => setEditForm({ ...editForm, treatment: e.target.value })}
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Source *</label>
              <select
                value={editForm.bookingSource}
                onChange={(e) => setEditForm({ ...editForm, bookingSource: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none text-xs"
                required
              >
                <option value="Receptionist">Receptionist</option>
                <option value="Doctor">Doctor</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Email">Email</option>
                <option value="Website">Website</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
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
              <Input
                label="Date"
                type="date"
                value={editForm.date}
                disabled={selectedApt && ["Checked In", "In Treatment", "Patient Arrived"].includes(selectedApt.status)}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot *</label>
              <TimeSlotPicker
                selectedDate={editForm.date}
                selectedTimeSlot={editForm.time}
                onSelectTimeSlot={(t) => setEditForm({ ...editForm, time: t })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
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
              <Button type="button" variant="secondary" onClick={() => setModalType("edit")}>
                Cancel
              </Button>
              <Button type="button" onClick={handleConfirmEditSubmit}>
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
              <Button type="button" variant="secondary" size="sm" onClick={() => setModalType(null)}>
                Cancel
              </Button>
              <Button type="primary" size="sm" onClick={handleConfirmComplete}>
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
              placeholder="e.g. Anusha Reddy"
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
                  <option value="Receptionist">Receptionist</option>
                  <option value="Doctor">Doctor</option>
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
                placeholder="Additional clinic notes..."
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
              <Button type="submit">Confirm Booking</Button>
            </div>
          </form>
        </Modal>

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={modalType === "cancel"}
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
    </DashboardLayout>
  );
}

// src/components/bookAppointment/AppointmentForm.jsx

import React, { useState, useEffect } from "react";
import { useAppointment } from "./useAppointment";
import { bookAppointment } from "../../../api/publicAppointmentApi";
import { initialFormValues } from "../../../data/appointment/appointmentData";
import { treatmentOptions } from "../../../data/appointment/treatments";
import { useDialog } from "../../../context/DialogContext";
import DatePickerPopover from "./DatePickerPopover";
import TimeSlotPicker from "./TimeSlotPicker";

import eventBus from "../../../utils/eventBus";

const VALID_TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"
];

export const AppointmentForm = () => {
  const { defaultTreatment, closeModal } = useAppointment();
  const { showWarning, showError, showSuccess } = useDialog();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultTreatment) {
      setFormValues((prev) => ({ ...prev, treatment: defaultTreatment }));
    } else {
      setFormValues((prev) => ({ ...prev, treatment: "" }));
    }
  }, [defaultTreatment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    // Restrict input while typing: allow numbers only, max length 10
    const onlyNums = rawVal.replace(/\D/g, "").slice(0, 10);
    setFormValues((prev) => ({ ...prev, phone: onlyNums }));

    // Show validation immediately when invalid
    if (onlyNums.length > 0 && onlyNums.length < 10) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid 10-digit mobile number."
      }));
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleDateChange = (newDate) => {
    setFormValues((prev) => ({
      ...prev,
      date: newDate,
      timeSlot: ""
    }));
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: "" }));
    }
    if (errors.timeSlot) {
      setErrors((prev) => ({ ...prev, timeSlot: "" }));
    }
  };

  const handleTimeSlotSelect = (slot) => {
    setFormValues((prev) => ({ ...prev, timeSlot: slot }));
    if (errors.timeSlot) {
      setErrors((prev) => ({ ...prev, timeSlot: "" }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formValues.fullName.trim()) {
      tempErrors.fullName = "Full name is required";
    }

    if (!formValues.phone || formValues.phone.length !== 10 || !/^\d{10}$/.test(formValues.phone)) {
      tempErrors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (!formValues.email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      tempErrors.email = "Enter a valid email address";
    }

    if (!formValues.treatment) {
      tempErrors.treatment = "Treatment is required";
    }

    if (!formValues.date) {
      tempErrors.date = "Please select a date";
    } else {
      const todayObj = new Date();
      const todayY = todayObj.getFullYear();
      const todayM = String(todayObj.getMonth() + 1).padStart(2, "0");
      const todayD = String(todayObj.getDate()).padStart(2, "0");
      const todayStr = `${todayY}-${todayM}-${todayD}`;

      if (formValues.date < todayStr) {
        tempErrors.date = "Appointments cannot be booked for past dates.";
        showWarning("Appointments cannot be booked for past dates. Please select today or a future date.", "Invalid Appointment Date");
      }
    }

    if (!formValues.timeSlot) {
      tempErrors.timeSlot = "Please select a time slot";
    } else if (!VALID_TIME_SLOTS.includes(formValues.timeSlot)) {
      tempErrors.timeSlot = "Selected time is outside working hours";
      showWarning("Appointments can only be scheduled during clinic working hours. Please select a valid time slot.", "Invalid Appointment Time");
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let cleanedPhone = formValues.phone.replace(/[\s\-\(\)]/g, "");
      if (cleanedPhone.startsWith("+91")) {
        cleanedPhone = cleanedPhone.slice(3);
      } else if (cleanedPhone.startsWith("91") && cleanedPhone.length === 12) {
        cleanedPhone = cleanedPhone.slice(2);
      } else if (cleanedPhone.startsWith("0") && cleanedPhone.length === 11) {
        cleanedPhone = cleanedPhone.slice(1);
      }

      const payload = {
        name: formValues.fullName,
        phone: cleanedPhone || formValues.phone,
        email: formValues.email,
        appointmentDate: formValues.date,
        appointmentTime: formValues.timeSlot,
        treatment: formValues.treatment,
        message: formValues.message,
      };

      const result = await bookAppointment(payload);

      setIsSubmitting(false);

      // Rule 10: Emit STATE_UPDATED so sidebar request count and tables refresh
      eventBus.emit("STATE_UPDATED");

      closeModal();

      showSuccess(
        "Thank you for choosing Kavuturu Dental Clinic.\n\nYour appointment request has been received successfully. Our team will review your request and contact you within 2–4 business hours to confirm your appointment.",
        "Appointment Request Submitted",
        {
          confirmText: "Done",
          summaryData: {
            patientName: formValues.fullName,
            treatment: formValues.treatment,
            date: formValues.date,
            time: formValues.timeSlot,
          },
          emailSent: Boolean(formValues.email && formValues.email.trim() !== ""),
        }
      );
    } catch (error) {
      setIsSubmitting(false);

      const title = error.response?.data?.title || "Booking Failed";
      const message =
        error.response?.data?.message ||
        "Failed to book appointment. Please try again.";

      showWarning(message, title);

      console.error("Booking submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-left select-none font-sans max-w-[620px] mx-auto">
      
      {/* 1. Full Name & Phone Number Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        <div>
          <label htmlFor="fullName" className="block text-xs font-medium text-slate-700 mb-1">
            Full Name <span className="text-slate-900 font-bold">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formValues.fullName}
            onChange={handleInputChange}
            className={`w-full rounded-xl border bg-white px-3.5 h-10 sm:h-10.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
              errors.fullName
                ? "border-rose-400"
                : "border-slate-200 focus:border-[#0E2A6D] focus:ring-1 focus:ring-[#0E2A6D]"
            }`}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-1 text-[11px] font-medium text-rose-500">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-slate-700 mb-1">
            Phone Number <span className="text-slate-900 font-bold">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            maxLength={10}
            value={formValues.phone}
            onChange={handlePhoneChange}
            className={`w-full rounded-xl border bg-white px-3.5 h-10 sm:h-10.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
              errors.phone
                ? "border-rose-400"
                : "border-slate-200 focus:border-[#0E2A6D] focus:ring-1 focus:ring-[#0E2A6D]"
            }`}
            placeholder="9876543210"
          />
          {errors.phone && (
            <p className="mt-1 text-[11px] font-medium text-rose-500">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* 2. Email Address & Treatment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">
            Email Address <span className="text-slate-900 font-bold">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            className={`w-full rounded-xl border bg-white px-3.5 h-10 sm:h-10.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
              errors.email
                ? "border-rose-400"
                : "border-slate-200 focus:border-[#0E2A6D] focus:ring-1 focus:ring-[#0E2A6D]"
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-[11px] font-medium text-rose-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="treatment" className="block text-xs font-medium text-slate-700 mb-1">
            Treatment <span className="text-slate-900 font-bold">*</span>
          </label>
          <div className="relative">
            <select
              id="treatment"
              name="treatment"
              value={formValues.treatment}
              onChange={handleInputChange}
              className={`w-full rounded-xl border bg-white px-3.5 h-10 sm:h-10.5 text-xs sm:text-sm text-slate-900 outline-none transition-all cursor-pointer appearance-none ${
                errors.treatment
                  ? "border-rose-400"
                  : "border-slate-200 focus:border-[#0E2A6D] focus:ring-1 focus:ring-[#0E2A6D]"
              }`}
            >
              <option value="" disabled>Select treatment</option>
              {treatmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
          {errors.treatment && (
            <p className="mt-1 text-[11px] font-medium text-rose-500">{errors.treatment}</p>
          )}
        </div>
      </div>

      {/* 3. Preferred Date & Time Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        <div>
          <label htmlFor="date" className="block text-xs font-medium text-slate-700 mb-1">
            Preferred Date <span className="text-slate-900 font-bold">*</span>
          </label>
          <DatePickerPopover
            id="date"
            selectedDate={formValues.date}
            onDateChange={handleDateChange}
            error={errors.date}
          />
          {errors.date && (
            <p className="mt-1 text-[11px] font-medium text-rose-500">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Preferred Time <span className="text-slate-900 font-bold">*</span>
          </label>
          <TimeSlotPicker
            selectedDate={formValues.date}
            selectedTimeSlot={formValues.timeSlot}
            onSelectTimeSlot={handleTimeSlotSelect}
            error={errors.timeSlot}
          />
        </div>
      </div>

      {/* 4. Message (Optional) */}
      <div>
        <label htmlFor="message" className="block text-xs font-medium text-slate-700 mb-1">
          Message <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          id="message"
          name="message"
          value={formValues.message}
          onChange={handleInputChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 h-10 sm:h-10.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#0E2A6D] focus:ring-1 focus:ring-[#0E2A6D]"
          placeholder="Any specific requests or concerns..."
        />
      </div>

      {/* 5. Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 rounded-xl bg-[#0E2A6D] hover:bg-[#0a1f52] text-xs sm:text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer outline-none mt-1"
      >
        {isSubmitting ? "Booking Appointment..." : "Book Appointment"}
      </button>

      {/* Helper text below button */}
      <p className="text-center text-[11px] text-slate-500 font-normal">
        We'll confirm your appointment by email after your booking.
      </p>
    </form>
  );
};

export default AppointmentForm;

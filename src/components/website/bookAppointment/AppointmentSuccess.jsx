// src/components/bookAppointment/AppointmentSuccess.jsx

import React from "react";
import { ShieldCheck } from "lucide-react";
import { useAppointment } from "./useAppointment";

export const AppointmentSuccess = () => {
  const { closeModal } = useAppointment();

  return (
    <div className="py-6 sm:py-8 text-center flex flex-col items-center">
      {/* Animated Success Badge */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
        <ShieldCheck className="h-10 w-10 animate-pulse" />
      </div>

      {/* Success Heading */}
      <h3 className="mt-6 text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">
        Booking Request Sent!
      </h3>

      {/* Message */}
      <p className="mt-3 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed px-2">
        Thank you for choosing Kavuturu Dental Clinic. We have received your booking details and will contact you via phone or email within the next 2-4 business hours to finalize and confirm your slot.
      </p>

      {/* Close button */}
      <button
        onClick={closeModal}
        className="mt-8 w-full sm:w-auto rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 shadow-sm cursor-pointer"
      >
        Close Window
      </button>
    </div>
  );
};

export default AppointmentSuccess;

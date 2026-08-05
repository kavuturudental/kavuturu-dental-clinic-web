// src/components/bookAppointment/AppointmentModal.jsx

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useAppointment } from "./useAppointment";
import AppointmentHero from "./AppointmentHero";
import AppointmentForm from "./AppointmentForm";

export const AppointmentModal = () => {
  const { isOpen, closeModal } = useAppointment();
  const modalRef = useRef(null);

  // Close modal when pressing the ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeModal]);

  // Close modal when clicking outside of the modal card content container
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Card Content Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg md:max-w-[580px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-slate-100 transition-all duration-300 animate-[scaleUp_0.25s_ease-out] custom-scrollbar"
      >
        {/* Close Icon Button */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all outline-none cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <AppointmentHero />
        <AppointmentForm />
      </div>
    </div>
  );
};

export default AppointmentModal;

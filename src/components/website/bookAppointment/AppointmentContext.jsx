// src/components/bookAppointment/AppointmentContext.jsx

import React, { createContext, useState, useCallback } from "react";

export const AppointmentContext = createContext(null);

export const AppointmentProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTreatment, setDefaultTreatment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openModal = useCallback((treatmentSlug = "") => {
    setDefaultTreatment(treatmentSlug);
    setIsSubmitted(false);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setDefaultTreatment("");
    setIsSubmitted(false);
  }, []);

  const markAsSubmitted = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  return (
    <AppointmentContext.Provider
      value={{
        isOpen,
        defaultTreatment,
        isSubmitted,
        openModal,
        closeModal,
        markAsSubmitted
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

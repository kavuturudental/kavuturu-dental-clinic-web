// src/hooks/useAppointments.js

import { useContext } from "react";
import { AppointmentsContext } from "../context/AppointmentContext";

export default function useAppointments() {
  const context = useContext(AppointmentsContext);

  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentsProvider");
  }

  return context;
}
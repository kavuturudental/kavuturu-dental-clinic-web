// src/hooks/useAppointmentRequests.js

import { useContext } from "react";
import { AppointmentRequestContext } from "../context/AppointmentRequestContext";

export default function useAppointmentRequests() {
  const context = useContext(AppointmentRequestContext);

  if (!context) {
    throw new Error("useAppointmentRequests must be used within an AppointmentRequestProvider");
  }

  return context;
}

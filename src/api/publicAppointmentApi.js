// src/api/publicAppointmentApi.js

import api from "../services/api";

export const bookAppointment = async (appointmentData) => {
  const payload = {
    patientName: appointmentData.name || appointmentData.patientName || appointmentData.fullName,
    phone: appointmentData.phone || appointmentData.phoneNumber,
    email: appointmentData.email || "",
    treatment: appointmentData.treatment,
    preferredDate: appointmentData.appointmentDate || appointmentData.date || appointmentData.preferredDate,
    preferredTime: appointmentData.appointmentTime || appointmentData.timeSlot || appointmentData.time || appointmentData.preferredTime,
    message: appointmentData.message || "",
  };

  const response = await api.post("/appointment-requests", payload);
  return response.data;
};
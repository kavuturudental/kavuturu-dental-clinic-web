// src/api/publicAppointmentApi.js

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const bookAppointment = async (appointmentData) => {
  const payload = {
    patientName: appointmentData.name || appointmentData.patientName || appointmentData.fullName,
    phone: appointmentData.phone || appointmentData.phoneNumber,
    email: appointmentData.email || "",
    treatment: appointmentData.treatment,
    preferredDate: appointmentData.appointmentDate || appointmentData.date || appointmentData.preferredDate,
    preferredTime: appointmentData.appointmentTime || appointmentData.timeSlot || appointmentData.time || appointmentData.preferredTime,
    message: appointmentData.message || "",
    bookingSource: "Website",
  };

  const response = await API.post("/appointment-requests", payload);
  return response.data;
};
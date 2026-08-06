// src/api/appointmentApi.js

import api from "../services/api";

/**
 * Get All Appointments
 */
export const getAppointments = async (params = {}) => {
  const response = await api.get("/appointments", { params });
  return response.data;
};

/**
 * Get Single Appointment
 */
export const getAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};

/**
 * Create Appointment
 */
export const createAppointment = async (data) => {
  const response = await api.post("/appointments", data);
  return response.data;
};

/**
 * Update Appointment
 */
export const updateAppointment = async (id, data) => {
  const response = await api.put(`/appointments/${id}`, data);
  return response.data;
};

/**
 * Update Appointment Status
 */
export const updateAppointmentStatus = async (id, status) => {
  if (status === "Cancelled") {
    const response = await api.patch(`/appointments/${id}/cancel`);
    return response.data;
  }

  const response = await api.patch(`/appointments/${id}/status`, { status });
  return response.data;
};

/**
 * Cancel Appointment
 */
export const cancelAppointment = async (id) => {
  const response = await api.patch(`/appointments/${id}/cancel`);
  return response.data;
};

/**
 * Delete Appointment
 */
export const deleteAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};
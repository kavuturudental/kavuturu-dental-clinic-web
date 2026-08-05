// src/api/appointmentApi.js

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Automatically attach JWT token using localStorage.getItem("token")
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Get All Appointments
 */
export const getAppointments = async (params = {}) => {
  const response = await API.get("/appointments", { params });
  return response.data;
};

/**
 * Get Single Appointment
 */
export const getAppointmentById = async (id) => {
  const response = await API.get(`/appointments/${id}`);
  return response.data;
};

/**
 * Create Appointment
 */
export const createAppointment = async (data) => {
  const response = await API.post("/appointments", data);
  return response.data;
};

/**
 * Update Appointment
 */
export const updateAppointment = async (id, data) => {
  const response = await API.put(`/appointments/${id}`, data);
  return response.data;
};

/**
 * Update Appointment Status
 */
export const updateAppointmentStatus = async (id, status) => {
  if (status === "Cancelled") {
    const response = await API.patch(`/appointments/${id}/cancel`);
    return response.data;
  }

  const response = await API.patch(`/appointments/${id}/status`, { status });
  return response.data;
};

/**
 * Cancel Appointment
 */
export const cancelAppointment = async (id) => {
  const response = await API.patch(`/appointments/${id}/cancel`);
  return response.data;
};

/**
 * Delete Appointment
 */
export const deleteAppointment = async (id) => {
  const response = await API.delete(`/appointments/${id}`);
  return response.data;
};
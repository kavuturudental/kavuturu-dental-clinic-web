// src/services/doctorAppointmentApi.js

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const doctorAppointmentApi = {
  // Get all appointments
  async getAppointments(params = {}) {
    const response = await API.get("/appointments", { params });
    return response.data;
  },

  // Get appointment by ID
  async getAppointmentById(id) {
    const response = await API.get(`/appointments/${id}`);
    return response.data;
  },

  // Update appointment
  async updateAppointment(id, data) {
    const response = await API.put(`/appointments/${id}`, data);
    return response.data;
  },

  // Cancel appointment
  async cancelAppointment(id) {
    const response = await API.patch(`/appointments/${id}/cancel`);
    return response.data;
  },

  // Delete appointment
  async deleteAppointment(id) {
    const response = await API.delete(`/appointments/${id}`);
    return response.data;
  },
};

export default doctorAppointmentApi;
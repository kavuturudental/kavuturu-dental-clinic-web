// src/api/appointmentRequestApi.js

import api from "../services/api";

// Response interceptor to handle 401 Stale/Invalid Token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || "";
      if (msg.includes("User not found") || msg.includes("Invalid or expired token")) {
        console.warn("Stale token detected, clearing session.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("userUpdated", { detail: null }));
        if (window.location.pathname !== "/login" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Get All Appointment Requests
 */
export const getAppointmentRequests = async (params = {}) => {
  try {
    const response = await api.get("/appointment-requests", { params });
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw err;
    }
    const response = await api.get("/appointments", { params: { status: "Pending", ...params } });
    return response.data;
  }
};

/**
 * Get Single Appointment Request
 */
export const getAppointmentRequestById = async (id) => {
  try {
    const response = await api.get(`/appointment-requests/${id}`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw err;
    }
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  }
};

/**
 * Approve Appointment Request
 */
export const approveAppointmentRequest = async (id) => {
  try {
    const response = await api.patch(`/appointment-requests/${id}/approve`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw err;
    }
    const response = await api.patch(`/appointments/${id}/status`, { status: "Accepted" });
    return response.data;
  }
};

/**
 * Reject Appointment Request
 */
export const rejectAppointmentRequest = async (id, reason) => {
  try {
    const response = await api.patch(`/appointment-requests/${id}/reject`, { reason });
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw err;
    }
    const response = await api.patch(`/appointments/${id}/status`, { status: "Cancelled", reason });
    return response.data;
  }
};

/**
 * Reschedule Appointment Request
 */
export const rescheduleAppointmentRequest = async (id, newDate, newTime) => {
  try {
    const response = await api.patch(`/appointment-requests/${id}/reschedule`, { newDate, newTime });
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw err;
    }
    const response = await api.put(`/appointments/${id}`, { date: newDate, time: newTime });
    return response.data;
  }
};

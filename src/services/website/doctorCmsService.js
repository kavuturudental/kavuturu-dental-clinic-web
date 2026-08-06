// src/services/website/doctorCmsService.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE_URL = `${BASE_URL.replace(/\/$/, "")}/website/doctors`;

/**
 * Get Homepage Featured Doctor
 */
export const getFeaturedDoctor = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/featured`);
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
  } catch (error) {
    console.warn("Backend Featured Doctor API unavailable:", error.message);
  }

  return {
    success: true,
    data: null
  };
};

/**
 * Update Homepage Featured Doctor (Doctor JWT Required)
 */
export const updateFeaturedDoctor = async (payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/featured`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Get All Doctors (For Doctors Page)
 */
export const getAllDoctors = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
  } catch (error) {
    console.warn("Backend Doctors List API unavailable:", error.message);
  }

  return {
    success: true,
    data: []
  };
};

/**
 * Create Secondary Doctor (Doctor JWT Required)
 */
export const createDoctor = async (payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Update Secondary Doctor (Doctor JWT Required)
 */
export const updateDoctor = async (id, payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Delete Secondary Doctor (Doctor JWT Required)
 */
export const deleteDoctor = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  getFeaturedDoctor,
  updateFeaturedDoctor,
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor
};

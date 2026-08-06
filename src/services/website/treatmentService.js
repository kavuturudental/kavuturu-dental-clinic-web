// src/services/website/treatmentService.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE_URL = `${BASE_URL.replace(/\/$/, "")}/website/treatments`;

/**
 * Get All Treatments
 */
export const getTreatments = async (params = {}) => {
  try {
    const response = await axios.get(API_BASE_URL, { params });
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
  } catch (error) {
    console.warn("Backend Treatments API unavailable:", error.message);
  }

  return {
    success: true,
    data: []
  };
};

/**
 * Get Treatment By ID
 */
export const getTreatmentById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create Treatment (Requires Doctor Token)
 */
export const createTreatment = async (payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Update Treatment (Requires Doctor Token)
 */
export const updateTreatment = async (id, payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Delete Treatment (Requires Doctor Token)
 */
export const deleteTreatment = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  getTreatments,
  getTreatmentById,
  createTreatment,
  updateTreatment,
  deleteTreatment
};

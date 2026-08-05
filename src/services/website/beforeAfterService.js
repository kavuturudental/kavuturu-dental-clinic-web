// src/services/website/beforeAfterService.js

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/website/before-after";

/**
 * Get Before & After Cases (Optionally pass { homepage: "true" })
 */
export const getBeforeAfterCases = async (params = {}) => {
  try {
    const response = await axios.get(API_BASE_URL, { params });
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
  } catch (error) {
    console.warn("Backend Before & After API unavailable:", error.message);
  }

  return {
    success: true,
    data: []
  };
};

/**
 * Create Before & After Case (Doctor JWT Required)
 */
export const createBeforeAfterCase = async (payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Update Before & After Case (Doctor JWT Required)
 */
export const updateBeforeAfterCase = async (id, payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Delete Before & After Case (Doctor JWT Required)
 */
export const deleteBeforeAfterCase = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  getBeforeAfterCases,
  createBeforeAfterCase,
  updateBeforeAfterCase,
  deleteBeforeAfterCase
};

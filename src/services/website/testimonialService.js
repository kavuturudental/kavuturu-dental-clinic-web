// src/services/website/testimonialService.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE_URL = `${BASE_URL.replace(/\/$/, "")}/website/testimonials`;

/**
 * Get All Testimonials (Optionally pass { homepage: "true" })
 */
export const getTestimonials = async (params = {}) => {
  try {
    const response = await axios.get(API_BASE_URL, { params });
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
  } catch (error) {
    console.warn("Backend Testimonials API unavailable:", error.message);
  }

  return {
    success: true,
    data: []
  };
};

/**
 * Create Testimonial Review (Doctor JWT Required)
 */
export const createTestimonial = async (payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Update Testimonial Review (Doctor JWT Required)
 */
export const updateTestimonial = async (id, payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Delete Testimonial Review (Doctor JWT Required)
 */
export const deleteTestimonial = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};

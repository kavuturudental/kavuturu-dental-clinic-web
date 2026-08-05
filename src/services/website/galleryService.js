// src/services/website/galleryService.js

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/website/gallery";

/**
 * Get Gallery Images (Optionally pass { homepage: "true" })
 */
export const getGalleryImages = async (params = {}) => {
  try {
    const response = await axios.get(API_BASE_URL, { params });
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
  } catch (error) {
    console.warn("Backend Gallery API unavailable:", error.message);
  }

  return {
    success: true,
    data: []
  };
};

/**
 * Create Gallery Image (Doctor JWT Required)
 */
export const createGalleryImage = async (payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Update Gallery Image (Doctor JWT Required)
 */
export const updateGalleryImage = async (id, payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Delete Gallery Image (Doctor JWT Required)
 */
export const deleteGalleryImage = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
};

// src/services/website/blogService.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE_URL = `${BASE_URL.replace(/\/$/, "")}/website/blogs`;

/**
 * Get Blogs (Optionally pass { homepage: "true" })
 */
export const getBlogs = async (params = {}) => {
  try {
    const response = await axios.get(API_BASE_URL, { params });
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
  } catch (error) {
    console.warn("Backend Blog API unavailable:", error.message);
  }

  return {
    success: true,
    data: []
  };
};

/**
 * Get Single Blog Article by Slug or ID
 */
export const getBlogBySlugOrId = async (identifier) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${identifier}`);
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
  } catch (error) {
    console.warn("Failed to fetch blog article:", error.message);
  }

  return {
    success: false,
    data: null
  };
};

/**
 * Create Blog Article (Doctor JWT Required)
 */
export const createBlog = async (payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Update Blog Article (Doctor JWT Required)
 */
export const updateBlog = async (id, payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Delete Blog Article (Doctor JWT Required)
 */
export const deleteBlog = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  getBlogs,
  getBlogBySlugOrId,
  createBlog,
  updateBlog,
  deleteBlog
};

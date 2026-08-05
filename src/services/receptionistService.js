// src/services/receptionistService.js

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/doctor/receptionists";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const receptionistService = {
  getReceptionists: async () => {
    const res = await axios.get(API_BASE_URL, getAuthHeaders());
    return res.data;
  },

  createReceptionist: async (data) => {
    const res = await axios.post(API_BASE_URL, data, getAuthHeaders());
    return res.data;
  },

  updateReceptionist: async (id, data) => {
    const res = await axios.put(`${API_BASE_URL}/${id}`, data, getAuthHeaders());
    return res.data;
  },

  resetPassword: async (id, passwords) => {
    const res = await axios.put(`${API_BASE_URL}/${id}/reset-password`, passwords, getAuthHeaders());
    return res.data;
  },

  deleteReceptionist: async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
    return res.data;
  },
};

export default receptionistService;

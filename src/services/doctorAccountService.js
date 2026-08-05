// src/services/doctorAccountService.js

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const doctorAccountService = {
  getProfile: async () => {
    const res = await axios.get(`${API_BASE_URL}/profile`, getAuthHeaders());
    return res.data;
  },

  updateProfile: async (payload) => {
    const res = await axios.put(`${API_BASE_URL}/profile`, payload, getAuthHeaders());
    return res.data;
  },

  changePassword: async (payload) => {
    const res = await axios.put(`${API_BASE_URL}/change-password`, payload, getAuthHeaders());
    return res.data;
  },
};

export default doctorAccountService;

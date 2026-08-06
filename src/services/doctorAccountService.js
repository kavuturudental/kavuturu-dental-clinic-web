// src/services/doctorAccountService.js

import api from "./api";

export const doctorAccountService = {
  getProfile: async () => {
    const res = await api.get("/auth/profile");
    return res.data;
  },

  updateProfile: async (payload) => {
    const res = await api.put("/auth/profile", payload);
    return res.data;
  },

  changePassword: async (payload) => {
    const res = await api.put("/auth/change-password", payload);
    return res.data;
  },
};

export default doctorAccountService;

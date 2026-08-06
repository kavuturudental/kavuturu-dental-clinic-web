// src/services/website/contactService.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE_URL = `${BASE_URL.replace(/\/$/, "")}/website/contact`;

/**
 * Get Contact Information (Single record)
 */
export const getContact = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    console.warn("Failed to fetch contact information:", error.message);
  }

  return {
    success: false,
    data: null,
  };
};

/**
 * Update Contact Information (Modify single record, Doctor JWT required)
 */
export const updateContact = async (payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(API_BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("STATE_UPDATED", { detail: { source: "CMS_CONTACT_UPDATE" } }));
    window.dispatchEvent(new CustomEvent("CONTACT_UPDATED", { detail: response.data?.data }));
  }

  return response.data;
};

export default {
  getContact,
  updateContact,
};

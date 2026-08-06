// src/services/website/aboutService.js

import axios from "axios";
import websiteService from "../websiteService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE_URL = `${BASE_URL.replace(/\/$/, "")}/website/about`;

/**
 * Get About Content from Backend API (Fallback to Local/Mock if Offline)
 */
export const getAboutContent = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
  } catch (error) {
    console.warn("Backend About API unavailable, using local persistence:", error.message);
  }

  // Local fallback
  const hp = websiteService.getHomepage() || {};
  const about = hp.about || {};

  return {
    success: true,
    data: {
      heading: about.title || about.heading || "Creating Healthy, Confident Smiles Every Day",
      description: about.subtitle || about.description || "At Kavuturu Dental Clinic, we are committed to providing advanced, comfortable, and personalized dental care for every patient. Our experienced team combines modern technology with compassionate treatment to help you achieve a healthy, confident smile in a welcoming environment."
    }
  };
};

/**
 * Update About Content via Backend PUT API (Requires Doctor JWT Token)
 */
export const updateAboutContent = async (payload) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(API_BASE_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data && response.data.success) {
      // Sync local persistence cache
      websiteService.saveHomepage({
        ...websiteService.getHomepage(),
        about: {
          title: payload.heading,
          subtitle: payload.description,
          heading: payload.heading,
          description: payload.description
        }
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("STATE_UPDATED", { detail: { source: "CMS_ABOUT_UPDATE", about: payload } }));
        window.dispatchEvent(new CustomEvent("ABOUT_UPDATED", { detail: payload }));
      }

      return {
        success: true,
        data: response.data.data || payload,
        message: response.data.message || "About section updated successfully."
      };
    }
  } catch (error) {
    console.error("Failed to update About API:", error);

    // Fallback sync
    websiteService.saveHomepage({
      ...websiteService.getHomepage(),
      about: {
        title: payload.heading,
        subtitle: payload.description,
        heading: payload.heading,
        description: payload.description
      }
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("STATE_UPDATED", { detail: { source: "CMS_ABOUT_UPDATE", about: payload } }));
      window.dispatchEvent(new CustomEvent("ABOUT_UPDATED", { detail: payload }));
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export default {
  getAboutContent,
  updateAboutContent
};
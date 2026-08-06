// src/services/website/heroService.js

import axios from "axios";
import websiteService from "../websiteService";
import { heroData } from "../../data/website/heroData";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE_URL = `${BASE_URL.replace(/\/$/, "")}/website/hero`;

/**
 * Get Hero Content from Backend API (Fallback to Local/Mock if Offline)
 */
export const getHeroContent = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
  } catch (error) {
    console.warn("Backend Hero API unavailable, using local persistence:", error.message);
  }

  // Local fallback
  const hp = websiteService.getHomepage() || {};
  const hero = hp.hero || {};

  const defaultStats = [
    { value: "20,000+", title: "RCTs Completed", subtitle: "" },
    { value: "14+", title: "Years of Clinical Experience", subtitle: "" },
    { value: "5★", title: "Google Rating", subtitle: "" },
    { value: "Trusted Dental Care", title: "in Tirupati", subtitle: "" }
  ];

  return {
    success: true,
    data: {
      trustBadge: hero.badge || hero.trustBadge || heroData.badge?.text || "EXPERT CARE. ADVANCED TECHNOLOGY.",
      heading: hero.title || hero.heading || heroData.heading || "Advanced Laser & Implant Dentistry",
      accentSubheading: hero.accentSubheading || heroData.accentSubheading || "for a Healthier, Happier Smile",
      description: hero.subtitle || hero.description || heroData.description || "Painless treatments. Beautiful smiles.\nPersonalized care for you and your family.",
      stats: Array.isArray(hero.stats) && hero.stats.length === 4 ? hero.stats : defaultStats
    }
  };
};

/**
 * Update Hero Content via Backend PUT API (Requires Doctor Token)
 */
export const updateHeroContent = async (payload) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(API_BASE_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data && response.data.success) {
      // Also sync local persistence cache
      websiteService.saveHomepage({
        ...websiteService.getHomepage(),
        hero: {
          badge: payload.trustBadge,
          title: payload.heading,
          accentSubheading: payload.accentSubheading,
          subtitle: payload.description,
          description: payload.description,
          stats: payload.stats
        }
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("STATE_UPDATED", { detail: { source: "CMS_HERO_UPDATE", hero: payload } }));
        window.dispatchEvent(new CustomEvent("HERO_UPDATED", { detail: payload }));
      }

      return {
        success: true,
        data: response.data.data || payload,
        message: response.data.message || "Hero content saved successfully."
      };
    }
  } catch (error) {
    console.error("Failed to update Hero API:", error);
    // If local fallback allowed
    websiteService.saveHomepage({
      ...websiteService.getHomepage(),
      hero: {
        badge: payload.trustBadge,
        title: payload.heading,
        accentSubheading: payload.accentSubheading,
        subtitle: payload.description,
        description: payload.description,
        stats: payload.stats
      }
    });
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("STATE_UPDATED", { detail: { source: "CMS_HERO_UPDATE", hero: payload } }));
      window.dispatchEvent(new CustomEvent("HERO_UPDATED", { detail: payload }));
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export default {
  getHeroContent,
  updateHeroContent
};

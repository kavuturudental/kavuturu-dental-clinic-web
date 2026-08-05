// src/utils/statIconHelper.js

import {
  Users,
  Sparkles,
  Smile,
  GraduationCap,
  Star,
  Trophy,
  BadgeCheck,
  Stethoscope,
  Building2,
  Award
} from "lucide-react";

/**
 * Automatically determines the appropriate Lucide React icon based on statistic label keywords.
 * @param {string} label - Statistic label string (e.g. "Happy Patients", "Root Canal Treatments")
 * @returns React.Component - Matching Lucide Icon component (fallback: Award)
 */
export const getStatIcon = (label = "") => {
  if (!label || typeof label !== "string") return Award;
  const normalized = label.toLowerCase().trim();

  if (
    normalized.includes("patient") ||
    normalized.includes("user") ||
    normalized.includes("people")
  ) {
    return Users;
  }

  if (
    normalized.includes("root canal") ||
    normalized.includes("implant") ||
    normalized.includes("tooth") ||
    normalized.includes("teeth") ||
    normalized.includes("treatment") ||
    normalized.includes("dental")
  ) {
    return Sparkles;
  }

  if (
    normalized.includes("smile") ||
    normalized.includes("makeover")
  ) {
    return Smile;
  }

  if (
    normalized.includes("experience") ||
    normalized.includes("year") ||
    normalized.includes("graduation") ||
    normalized.includes("degree")
  ) {
    return GraduationCap;
  }

  if (
    normalized.includes("rating") ||
    normalized.includes("google") ||
    normalized.includes("star") ||
    normalized.includes("review")
  ) {
    return Star;
  }

  if (
    normalized.includes("award") ||
    normalized.includes("trophy") ||
    normalized.includes("winner")
  ) {
    return Trophy;
  }

  if (
    normalized.includes("certif") ||
    normalized.includes("badge") ||
    normalized.includes("certified")
  ) {
    return BadgeCheck;
  }

  if (
    normalized.includes("doctor") ||
    normalized.includes("specialist") ||
    normalized.includes("surgeon")
  ) {
    return Stethoscope;
  }

  if (
    normalized.includes("clinic") ||
    normalized.includes("hospital") ||
    normalized.includes("center")
  ) {
    return Building2;
  }

  // Fallback default icon if no keyword matches
  return Award;
};

export default getStatIcon;

// src/utils/dateUtils.js

/**
 * Format a Date object as YYYY-MM-DD in local timezone.
 * Prevents UTC timezone shifting.
 */
export const getLocalDateString = (d = new Date()) => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Returns tomorrow's date string YYYY-MM-DD in local timezone.
 */
export const getTomorrowDateString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getLocalDateString(tomorrow);
};

/**
 * Cleanly format any date input into DATE ONLY (e.g. "06 Aug 2026" or "Thu, 06 Aug 2026").
 * Stricly removes "05.30.00", "05:30:00", "GMT", "+0530" or ISO time suffixes.
 */
export const cleanDateOnly = (dateInput, withDayName = false) => {
  if (!dateInput) return "";
  let str = String(dateInput).trim();

  // Strip GMT, offset, or time residue
  if (str.includes("GMT") || str.includes("+0530") || str.includes("05.30") || str.includes("05:30")) {
    str = str.split("GMT")[0].split("+")[0].split("05:30")[0].split("05.30")[0].trim();
  }

  const datePart = str.includes("T") ? str.split("T")[0] : str.split(" ")[0];
  const [y, m, d] = datePart.split("-");

  if (y && m && d && y.length === 4) {
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    if (!isNaN(dateObj.getTime())) {
      if (withDayName) {
        return dateObj.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric"
        }); // e.g. "Thu, 06 Aug 2026"
      }
      return dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }); // e.g. "06 Aug 2026"
    }
  }

  return str;
};

/**
 * Cleanly format any time input into TIME ONLY in IST 12-hour format (e.g. "09:00 AM").
 * Strips date string, GMT, or offset residue.
 */
export const cleanTimeIST = (timeInput) => {
  if (!timeInput) return "";
  let str = String(timeInput).trim();

  // Strip GMT, offset, or full date strings if ISO
  if (str.includes("GMT") || str.includes("+0530") || str.includes("T")) {
    const dateObj = new Date(str);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
      });
    }
  }

  // 12-hour format matching (e.g. "09:00 AM")
  const match12 = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)/i);
  if (match12) {
    const hh = match12[1].padStart(2, "0");
    const mm = match12[2];
    const ampm = match12[3].toUpperCase();
    return `${hh}:${mm} ${ampm}`;
  }

  // 24-hour format matching (e.g. "09:00" or "14:30")
  const match24 = str.match(/(\d{1,2}):(\d{2})/);
  if (match24) {
    let hours = parseInt(match24[1]);
    const minutes = match24[2];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  }

  return str;
};

/**
 * Safely extracts and formats any appointment status string or object into a human-readable display string.
 * Examples:
 * - "checked_in" -> "Checked In"
 * - "completed" -> "Completed"
 * - { label: "Checked In", value: "checked_in" } -> "Checked In"
 * - { status: "confirmed" } -> "Confirmed"
 */
export const formatStatusDisplay = (statusInput) => {
  if (!statusInput) return "Pending";

  let rawStr = "";

  if (typeof statusInput === "string") {
    rawStr = statusInput;
  } else if (typeof statusInput === "object") {
    rawStr =
      statusInput.label ||
      statusInput.value ||
      statusInput.name ||
      statusInput.status ||
      statusInput.title ||
      "";
  } else {
    rawStr = String(statusInput);
  }

  if (!rawStr || rawStr === "[object Object]") {
    return "Updated";
  }

  // Handle snake_case, kebab-case, or space separated words
  let formatted = rawStr
    .replace(/[_\-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formatted;
};

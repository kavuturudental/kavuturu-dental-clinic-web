// src/utils/reviewDateHelper.js

/**
 * Parse human review date string into relative days ago for chronological sorting
 * e.g. "Today" / "Recent" -> 0
 *      "2 days ago" -> 2
 *      "1 week ago" -> 7
 *      "2 weeks ago" -> 14
 *      "1 month ago" -> 30
 *      "2 months ago" -> 60
 *      "Dec 2026" / "Jan 2027" -> relative days diff
 */
export const parseReviewDateToDaysAgo = (str) => {
  if (!str || typeof str !== "string") return 99999;
  const lower = str.toLowerCase().trim();

  if (lower.includes("today") || lower.includes("just now") || lower.includes("recent")) return 0;
  if (lower.includes("yesterday")) return 1;

  // Match "X days ago" / "X day ago"
  const dayMatch = lower.match(/^(\d+)\s+day/);
  if (dayMatch) return parseInt(dayMatch[1], 10);

  // Match "X weeks ago" / "X week ago"
  const weekMatch = lower.match(/^(\d+)\s+week/);
  if (weekMatch) return parseInt(weekMatch[1], 10) * 7;

  // Match "X months ago" / "X month ago"
  const monthMatch = lower.match(/^(\d+)\s+month/);
  if (monthMatch) return parseInt(monthMatch[1], 10) * 30;

  // Match "X years ago" / "X year ago"
  const yearMatch = lower.match(/^(\d+)\s+year/);
  if (yearMatch) return parseInt(yearMatch[1], 10) * 365;

  // Try parsing absolute Date (e.g., "Dec 2026", "Jan 2027")
  const parsedDate = Date.parse(str);
  if (!isNaN(parsedDate)) {
    const diffMs = Date.now() - parsedDate;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  return 99999;
};

/**
 * Sort testimonials array by review date chronologically (most recent review date first)
 */
export const sortTestimonialsByReviewDate = (items = []) => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const daysA = parseReviewDateToDaysAgo(a.reviewDate);
    const daysB = parseReviewDateToDaysAgo(b.reviewDate);
    if (daysA !== daysB) {
      return daysA - daysB; // Smaller days ago = more recent = first!
    }
    // Fallback tie-breaker: createdAt timestamp
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
};

export default {
  parseReviewDateToDaysAgo,
  sortTestimonialsByReviewDate,
};

// src/utils/businessHours.js

/**
 * Central Configuration for Clinic Business Hours
 * Mon - Sat: 9:30 AM - 9:00 PM
 * Sun: 10:00 AM - 1:30 PM
 */
export const businessHoursConfig = {
  // Monday - Saturday (Days 1 to 6)
  weekday: {
    label: "Mon - Sat: 9:30 AM - 9:00 PM",
    startHour: 9,
    startMinute: 30,
    endHour: 21,
    endMinute: 0,
  },
  // Sunday (Day 0)
  sunday: {
    label: "Sun: 10:00 AM - 1:30 PM",
    startHour: 10,
    startMinute: 0,
    endHour: 13,
    endMinute: 30,
  },
};

/**
 * Calculates current clinic status based on local time
 * Returns { isOpen, statusText, hoursText }
 */
export const getClinicStatus = (date = new Date()) => {
  const day = date.getDay(); // 0 = Sunday, 1-6 = Mon-Sat
  const config = day === 0 ? businessHoursConfig.sunday : businessHoursConfig.weekday;

  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const startMinutes = config.startHour * 60 + config.startMinute;
  const endMinutes = config.endHour * 60 + config.endMinute;

  const isOpen = currentMinutes >= startMinutes && currentMinutes < endMinutes;

  return {
    isOpen,
    statusText: isOpen ? "Open Now" : "Closed Now",
    hoursText: config.label,
  };
};

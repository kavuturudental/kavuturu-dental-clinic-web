// src/data/appointment/appointmentData.js

export const timeSlots = {
  morning: [
    { time: "09:00 AM", period: "Morning" },
    { time: "09:30 AM", period: "Morning" },
    { time: "10:00 AM", period: "Morning" },
    { time: "10:30 AM", period: "Morning" },
    { time: "11:00 AM", period: "Morning" },
    { time: "11:30 AM", period: "Morning" }
  ],
  afternoon: [
    { time: "12:00 PM", period: "Afternoon" },
    { time: "12:30 PM", period: "Afternoon" },
    { time: "02:00 PM", period: "Afternoon" },
    { time: "02:30 PM", period: "Afternoon" },
    { time: "03:00 PM", period: "Afternoon" },
    { time: "03:30 PM", period: "Afternoon" },
    { time: "04:00 PM", period: "Afternoon" },
    { time: "04:30 PM", period: "Afternoon" },
    { time: "05:00 PM", period: "Afternoon" },
    { time: "05:30 PM", period: "Afternoon" }
  ],
  evening: [
    { time: "06:00 PM", period: "Evening" },
    { time: "06:30 PM", period: "Evening" },
    { time: "07:00 PM", period: "Evening" }
  ]
};

export const initialFormValues = {
  fullName: "",
  email: "",
  phone: "",
  treatment: "",
  date: "",
  timeSlot: "",
  message: ""
};

/**
 * Returns a clean formatted date string for display (e.g., "Thu, 16 Jul 2026")
 */
export const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  if (isNaN(dateObj.getTime())) return dateString;

  const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  const dayOfMonth = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });
  const yearNum = dateObj.getFullYear();

  return `${dayOfWeek}, ${dayOfMonth} ${monthName} ${yearNum}`;
};

/**
 * Returns list of booked/unavailable time slots for a given date.
 * Simulates real clinic booking system.
 */
export const getBookedSlotsForDate = (dateString) => {
  if (!dateString) return [];
  
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const allTimes = [
    ...timeSlots.morning.map(s => s.time),
    ...timeSlots.afternoon.map(s => s.time),
    ...timeSlots.evening.map(s => s.time)
  ];

  const slot1 = allTimes[absHash % allTimes.length];
  const slot2 = allTimes[(absHash + 4) % allTimes.length];

  return [slot1, slot2].filter((v, i, a) => a.indexOf(v) === i);
};

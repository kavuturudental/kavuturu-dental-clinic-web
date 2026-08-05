// src/receptionist/data/notificationsData.js

export const notificationsData = [
  {
    id: "not-1",
    type: "request",
    title: "New Appointment Request",
    description: "Vikram Reddy requested an appointment for Laser Root Canal on 21 Jul 2026.",
    timeAgo: "2 min ago",
    read: false
  },
  {
    id: "not-2",
    type: "reminder",
    title: "Appointment Starts Soon",
    description: "K. Venkatesh's Laser Gum Treatment appointment starts in 15 minutes.",
    timeAgo: "15 min ago",
    read: false
  },
  {
    id: "not-3",
    type: "checkin",
    title: "Patient Checked In",
    description: "B. Sunitha has arrived at reception and checked in for Single Tooth Filling.",
    timeAgo: "25 min ago",
    read: false
  },
  {
    id: "not-4",
    type: "rescheduled",
    title: "Appointment Rescheduled",
    description: "Priya Sharma rescheduled her Braces & Aligners consultation to 03:30 PM today.",
    timeAgo: "40 min ago",
    read: true
  },
  {
    id: "not-5",
    type: "cancelled",
    title: "Appointment Cancelled",
    description: "M. Satyanarayana cancelled the Crowns & Bridges appointment for 05:00 PM.",
    timeAgo: "1 hour ago",
    read: true
  }
];

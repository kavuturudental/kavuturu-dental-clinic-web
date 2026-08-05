export const dashboardStats = [
  {
    id: "today-appointments",
    title: "Today's Appointments",
    value: "4",
    description: "Scheduled for today",
    type: "primary", // maps to #0E2A6D color theme
    icon: "Calendar"
  },
  {
    id: "pending-requests",
    title: "Pending Requests",
    value: "3",
    description: "Awaiting confirmation",
    type: "warning", // maps to #F59E0B color theme
    icon: "Clock"
  },
  {
    id: "completed-today",
    title: "Completed Today",
    value: "1",
    description: "Checked out successfully",
    type: "success", // maps to #16A34A color theme
    icon: "CheckCircle"
  },
  {
    id: "cancelled-today",
    title: "Cancelled Today",
    value: "0",
    description: "Cancelled appointments",
    type: "danger", // maps to #EF4444 color theme
    icon: "XCircle"
  }
];

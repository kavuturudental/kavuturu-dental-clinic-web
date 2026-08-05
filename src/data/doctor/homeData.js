export const homeData = {
  welcomeMessage: "Welcome back, Dr. K. Ravindra Babu.",
  subtitle: "Choose a module to continue.",
  modules: [
    {
      id: "appointment-management",
      title: "Appointment Management",
      description: "Manage appointments, patient schedules, treatment details and visit history.",
      buttonText: "Open Appointment Management →",
      path: "/doctor/appointment-management",
      gradient: "from-blue-500/10 to-indigo-500/5 hover:from-blue-500/20 hover:to-indigo-500/10",
      borderHover: "hover:border-blue-300",
      buttonBg: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20",
      accentColor: "text-blue-600",
      illustrationType: "appointment"
    },
    {
      id: "website-management",
      title: "Website Management",
      description: "Update website pages, blogs, gallery, testimonials and clinic content.",
      buttonText: "Open Website Management →",
      path: "/doctor/website-management",
      gradient: "from-emerald-500/10 to-teal-500/5 hover:from-emerald-500/20 hover:to-teal-500/10",
      borderHover: "hover:border-emerald-300",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/20",
      accentColor: "text-emerald-600",
      illustrationType: "website"
    }
  ]
};

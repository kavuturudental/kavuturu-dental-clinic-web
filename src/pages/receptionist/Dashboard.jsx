// src/receptionist/pages/Dashboard.jsx

import React from "react";
import DashboardLayout from "../../components/receptionist/layout/DashboardLayout";
import DashboardSummaryCards from "../../components/common/DashboardSummaryCards";
import Appointments from "./Appointments";

export default function Dashboard() {
  return <Appointments />;
}

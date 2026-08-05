import React from "react";
import { Link } from "react-router-dom";
import DashboardStatsCard from "./DashboardStatsCard";
import { dashboardStats } from "../../../data/receptionist/dashboardData";

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {dashboardStats.map((stat) => {
        const linkPath = stat.id === "pending-requests"
          ? "/receptionist/appointment-requests"
          : "/receptionist/appointments";

        return (
          <Link key={stat.id} to={linkPath} className="block cursor-pointer">
            <DashboardStatsCard
              title={stat.title}
              value={stat.value}
              description={stat.description}
              iconName={stat.icon}
              type={stat.type}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default StatsCards;

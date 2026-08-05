import React, { useContext } from "react";
import { ReceptionistContext } from "../../../contexts/ReceptionistContext";

const WelcomeCard = () => {
  const { receptionistName } = useContext(ReceptionistContext);

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-center select-none h-full">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
          Good Morning, {receptionistName} 👋
        </h1>
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-bold text-[#0E2A6D]">
            Welcome back to Kavuturu Dental Clinic.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Today's appointments are ready for review.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;

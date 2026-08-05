import React, { useContext } from "react";
import { ReceptionistContext } from "../../../contexts/ReceptionistContext";

const UserProfile = ({ className }) => {
  const { receptionistName } = useContext(ReceptionistContext);

  const initials = receptionistName
    ? receptionistName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "R";

  return (
    <div className={`flex items-center gap-3 px-3 py-1.5 ${className}`}>
      <div className="w-10 h-10 rounded-full bg-[#0E2A6D]/10 flex items-center justify-center text-[#0E2A6D] font-extrabold text-sm border border-[#0E2A6D]/15 shadow-sm">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[13px] font-bold text-slate-800 truncate">{receptionistName}</h4>
        <p className="text-[11px] text-slate-400 font-medium truncate">staff@kavuturu.com</p>
      </div>
    </div>
  );
};

export default UserProfile;

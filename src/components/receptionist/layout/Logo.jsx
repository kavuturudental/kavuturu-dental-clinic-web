// src/receptionist/components/layout/Logo.jsx

import React from "react";
import logo from "../../../assets/images/logos/logo.png";

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src={logo}
        alt="Kavuturu Dental Clinic"
        className="h-10 w-auto object-contain flex-shrink-0"
      />
      <div>
        <h1 className="text-xs font-black text-[#0E2A6D] uppercase tracking-wider leading-tight">
          Kavuturu Dental
        </h1>
        <p className="text-[10px] font-extrabold text-slate-400">Reception Portal</p>
      </div>
    </div>
  );
};

export default Logo;

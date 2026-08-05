import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppointmentCard from "./AppointmentCard";
import WebsiteCard from "./WebsiteCard";

export default function ModuleCard({ module, index }) {
  const navigate = useNavigate();
  const {
    title,
    description,
    buttonText,
    path,
    gradient,
    borderHover,
    buttonBg,
    accentColor,
    illustrationType,
  } = module;

  const renderIllustration = () => {
    switch (illustrationType) {
      case "appointment":
        return <AppointmentCard />;
      case "website":
        return <WebsiteCard />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.015 }}
      onClick={() => navigate(path)}
      className={`bg-white rounded-[24px] border border-slate-100 p-4 sm:p-5 md:p-6 flex flex-col justify-between shadow-sm hover:shadow-[0_16px_40px_rgba(14,42,109,0.05)] cursor-pointer select-none transition-shadow duration-300 relative overflow-hidden group h-full ${borderHover}`}
    >
      {/* Background soft gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-300 opacity-60 group-hover:opacity-100 z-0`}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-between">
        {/* Large Illustration Area */}
        <div className="flex-1 min-h-0 max-h-[100px] sm:max-h-[130px] md:max-h-[150px] flex items-center justify-center mb-3 sm:mb-4 transform group-hover:scale-[1.02] transition-transform duration-500">
          {renderIllustration()}
        </div>

        {/* Content */}
        <div className="text-center space-y-1.5 mb-3">
          <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-[#0E2A6D] tracking-tight group-hover:text-primary-light transition-colors duration-200">
            {title}
          </h3>
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-10 mt-auto w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className={`w-full flex h-10 sm:h-11 items-center justify-center rounded-xl text-xs font-extrabold text-white shadow-sm hover:shadow-md transition-colors cursor-pointer outline-none focus:ring-4 ${buttonBg}`}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
}

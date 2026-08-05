// src/components/about/AboutBadge.jsx

import { Info } from "lucide-react";

const AboutBadge = ({ children }) => {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-sky-200
        bg-sky-50
        px-4
        py-1.5
        shadow-sm
      "
    >
      <Info className="w-3.5 h-3.5 text-sky-600" />
      <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
        {children}
      </span>
    </div>
  );
};

export default AboutBadge;
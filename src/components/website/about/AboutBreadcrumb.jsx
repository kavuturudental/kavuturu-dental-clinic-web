// src/components/about/AboutBreadcrumb.jsx

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutBreadcrumb = () => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-sm md:text-base"
    >
      <Link
        to="/"
        className="
          font-medium
          text-slate-500
          transition-colors
          duration-300
          hover:text-[#0E2A6D]
        "
      >
        Home
      </Link>

      <ChevronRight
        size={16}
        strokeWidth={2}
        className="text-slate-400"
      />

      <span
        aria-current="page"
        className="font-medium text-[#0E2A6D]"
      >
        About Us
      </span>
    </nav>
  );
};

export default AboutBreadcrumb;
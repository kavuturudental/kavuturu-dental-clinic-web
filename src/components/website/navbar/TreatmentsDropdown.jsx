// src/components/navbar/TreatmentsDropdown.jsx

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

import treatments from "../../../data/website/treatments";

function TreatmentsDropdown({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isTreatmentsActive =
    location.pathname === "/"
      ? activeSection === "treatments"
      : location.pathname.startsWith("/treatments");

  const handleTreatmentClick = (slug) => {
    navigate(`/treatments?section=${slug}`);
    setIsOpen(false);
  };

  const handleViewAllClick = () => {
    navigate("/treatments");
    setIsOpen(false);
  };

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        to="/treatments"
        className={clsx(
          "flex items-center gap-1 py-2 text-[15px] font-medium transition-colors duration-300 relative group",
          isTreatmentsActive
            ? "text-primary font-semibold"
            : "text-text-secondary hover:text-primary"
        )}
      >
        <span>Treatments</span>

        <ChevronDown
          className={clsx(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />{!isTreatmentsActive && (
          <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-secondary transition-all duration-300 group-hover:w-full" />
        )}
        {isTreatmentsActive && (
          <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-secondary transition-all duration-300" />
        )}
      </Link>

      <div
        className={`
          absolute
          left-1/2
          top-full
          mt-4
          w-[360px]
          -translate-x-1/2
          rounded-2xl
          border
          border-border
          bg-white
          p-3
          shadow-xl
          transition-all
          duration-200
          ${
            isOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
          }
        `}
      >
        <ul className="space-y-1">
          {treatments.map((treatment) => (
            <li key={treatment.id}>
              <button
                type="button"
                onClick={() =>
                  handleTreatmentClick(treatment.slug)
                }
                className="
                  w-full
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-[15px]
                  font-medium
                  text-text-primary
                  transition-all
                  duration-200
                  hover:bg-slate-50
                  hover:text-primary
                "
              >
                {treatment.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default TreatmentsDropdown;
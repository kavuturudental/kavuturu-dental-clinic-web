// src/components/footer/FooterColumn.jsx

import React from "react";
import { Link } from "react-router-dom";
import { normalizeRouteUrl } from "./FooterBottom";

const FooterColumn = ({ title, links, showViewAll = false }) => {
  return (
    <div>
      <h3 className="text-base font-bold text-white font-outfit">
        {title}
      </h3>

      <ul className="mt-7 space-y-5 font-sans">
        {links.map((link) => {
          const targetUrl = normalizeRouteUrl(link.href, link.label);
          return (
            <li key={link.label}>
              <Link
                to={targetUrl}
                className="text-[14px] text-slate-400 transition-colors duration-300 hover:text-[#16A34A] cursor-pointer"
              >
                {link.label}
              </Link>
            </li>
          );
        })}

        {showViewAll && (
          <li className="pt-1">
            <Link
              to="/treatments"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-secondary transition-colors duration-300 hover:text-secondary-dark cursor-pointer"
            >
              View All Treatments →
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default FooterColumn;

// src/components/about/Breadcrumb.jsx

import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center px-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center text-sm"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-medium text-slate-600 transition-colors duration-300 hover:text-sky-700"
          >
            <Home size={16} />
            <span>Home</span>
          </Link>

          <ChevronRight
            size={16}
            className="mx-2 text-slate-400"
          />

          <span
            aria-current="page"
            className="font-semibold text-slate-900"
          >
            About Us
          </span>
        </nav>
      </div>
    </section>
  );
};

export default Breadcrumb;

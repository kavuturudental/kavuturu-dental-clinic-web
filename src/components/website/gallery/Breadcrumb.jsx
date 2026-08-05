// src/components/gallery/Breadcrumb.jsx

import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center px-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm"
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-500 transition-colors hover:text-sky-600"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-400" />

          <span className="font-medium text-slate-900">
            Gallery
          </span>
        </nav>
      </div>
    </section>
  );
};

export default Breadcrumb;

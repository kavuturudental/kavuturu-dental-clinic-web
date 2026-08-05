import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({ items }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-sm font-medium"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-[#0E2A6D]">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.href}
                    className="text-slate-500 transition-colors hover:text-[#0E2A6D]"
                  >
                    {item.label}
                  </Link>

                  <ChevronRight
                    size={16}
                    className="text-slate-400"
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
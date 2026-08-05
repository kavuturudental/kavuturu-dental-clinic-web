import React from "react";
import clsx from "clsx";

const PageHeader = ({ title, description, children, className }) => {
  return (
    <div className={clsx("flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none mb-6", className)}>
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-none">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm font-medium text-slate-400">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2.5">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

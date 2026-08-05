// src/receptionist/components/common/SearchBar.jsx

import React from "react";
import { Search, X } from "lucide-react";
import clsx from "clsx";

const SearchBar = ({
  placeholder = "Search appointments, patients or phone...",
  value,
  onChange,
  onClear,
  className,
  ...props
}) => {
  return (
    <div className={clsx("relative w-full group select-none", className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-full border border-slate-200/90 bg-slate-50/80 hover:bg-slate-50 pl-11 pr-9 text-slate-900 placeholder:text-slate-400 font-medium text-xs transition-all duration-200 outline-none focus:border-slate-400 focus:bg-white shadow-2xs"
        {...props}
      />

      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange && onChange({ target: { value: "" } }))}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
